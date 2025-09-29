const Server = require('../models/Server');
const { validationResult } = require('express-validator');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Map to store server processes
const serverProcesses = new Map();

// @desc    Create a new server
// @route   POST /api/servers
// @access  Private
exports.createServer = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, version } = req.body;

  try {
    // Generate a unique port for the server
    const port = await getAvailablePort();
    
    // Create server directory
    const serverPath = path.join(os.homedir(), 'mc-servers', `server-${Date.now()}`);
    if (!fs.existsSync(serverPath)) {
      fs.mkdirSync(serverPath, { recursive: true });
    }

    // Create server instance
    const server = new Server({
      name,
      version,
      port,
      owner: req.user.id,
      path: serverPath
    });

    await server.save();

    // Add server to user's servers
    await User.findByIdAndUpdate(req.user.id, {
      $push: { servers: server._id }
    });

    res.status(201).json(server);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all user's servers
// @route   GET /api/servers
// @access  Private
exports.getServers = async (req, res) => {
  try {
    const servers = await Server.find({ owner: req.user.id });
    res.json(servers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get server by ID
// @route   GET /api/servers/:id
// @access  Private
exports.getServer = async (req, res) => {
  try {
    const server = await Server.findById(req.params.id);

    if (!server) {
      return res.status(404).json({ message: 'Server not found' });
    }

    // Check if user owns the server
    if (server.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(server);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Server not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Start a server
// @route   POST /api/servers/:id/start
// @access  Private
exports.startServer = async (req, res) => {
  try {
    const server = await Server.findById(req.params.id);

    if (!server) {
      return res.status(404).json({ message: 'Server not found' });
    }

    // Check if user owns the server
    if (server.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Check if server is already running
    if (server.status === 'running') {
      return res.status(400).json({ message: 'Server is already running' });
    }

    // Start the server process
    const serverJar = path.join(server.path, 'server.jar');
    const args = ['-Xmx2G', '-Xms1G', '-jar', serverJar, 'nogui'];
    
    const serverProcess = spawn('java', args, {
      cwd: server.path,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    // Store the process
    serverProcesses.set(server._id.toString(), serverProcess);

    // Handle server output
    serverProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`[${server.name}] ${output}`);
      
      // Emit to connected clients
      req.app.get('io').to(server._id.toString()).emit('console', output);
      
      // Check if server is fully started
      if (output.includes('Done') && output.includes('For help, type "help"')) {
        server.status = 'running';
        server.lastStarted = new Date();
        server.save();
      }
    });

    serverProcess.stderr.on('data', (data) => {
      const error = data.toString();
      console.error(`[${server.name} ERROR] ${error}`);
      req.app.get('io').to(server._id.toString()).emit('console', `ERROR: ${error}`);
    });

    serverProcess.on('close', (code) => {
      console.log(`[${server.name}] Process exited with code ${code}`);
      serverProcesses.delete(server._id.toString());
      server.status = 'stopped';
      server.lastStopped = new Date();
      server.save();
    });

    server.status = 'starting';
    await server.save();

    res.json({ message: 'Server is starting...' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Stop a server
// @route   POST /api/servers/:id/stop
// @access  Private
exports.stopServer = async (req, res) => {
  try {
    const server = await Server.findById(req.params.id);

    if (!server) {
      return res.status(404).json({ message: 'Server not found' });
    }

    // Check if user owns the server
    if (server.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const serverProcess = serverProcesses.get(server._id.toString());
    
    if (!serverProcess) {
      return res.status(400).json({ message: 'Server is not running' });
    }

    // Send stop command to the server
    serverProcess.stdin.write('stop\n');
    
    res.json({ message: 'Server is stopping...' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a server
// @route   DELETE /api/servers/:id
// @access  Private
exports.deleteServer = async (req, res) => {
  try {
    const server = await Server.findById(req.params.id);

    if (!server) {
      return res.status(404).json({ message: 'Server not found' });
    }

    // Check if user owns the server
    if (server.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Stop the server if it's running
    const serverProcess = serverProcesses.get(server._id.toString());
    if (serverProcess) {
      serverProcess.kill('SIGKILL');
      serverProcesses.delete(server._id.toString());
    }

    // Remove server directory
    const fs = require('fs-extra');
    await fs.remove(server.path);

    // Remove from database
    await server.remove();

    // Remove from user's servers
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { servers: server._id }
    });

    res.json({ message: 'Server removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Helper function to get an available port
async function getAvailablePort(startPort = 25565) {
  const net = require('net');
  
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.unref();
    
    server.on('error', () => {
      // Port is in use, try the next one
      resolve(getAvailablePort(startPort + 1));
    });
    
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => {
        resolve(port);
      });
    });
  });
}
