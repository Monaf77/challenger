require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const serverRoutes = require('./routes/servers');
const { errorHandler } = require('./middleware/error');

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('join-server', (serverId) => {
    socket.join(serverId);
    console.log(`User joined server: ${serverId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Make io accessible to routes
app.set('io', io);

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/servers', serverRoutes);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
