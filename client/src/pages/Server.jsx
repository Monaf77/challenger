import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { getServer, startServer, stopServer, deleteServer, updateServerStatus } from '../features/servers/serverSlice';
import { setAlert } from '../features/alert/alertSlice';
import { Container, Typography, Paper, Box, Button, Tabs, Tab, Divider, CircularProgress, IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { styled } from '@mui/material/styles';
import { PlayArrow, Stop, Delete, Edit, Save, Close } from '@mui/icons-material';
import ServerStatusChip from '../components/servers/ServerStatusChip';
import ConsoleOutput from '../components/servers/ConsoleOutput';
import ServerProperties from '../components/servers/ServerProperties';
import ServerPlayers from '../components/servers/ServerPlayers';

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(3),
}));

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`server-tabpanel-${index}`}
      aria-labelledby={`server-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const Server = ({ socket: propSocket }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentServer, loading } = useSelector((state) => state.servers);
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [serverName, setServerName] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [socket, setSocket] = useState(null);
  const consoleEndRef = useRef(null);

  // Initialize socket connection and fetch server data
  useEffect(() => {
    if (id) {
      dispatch(getServer(id));
      
      // Initialize socket connection
      const newSocket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');
      setSocket(newSocket);

      // Join server room
      newSocket.emit('join-server', id);

      // Listen for console updates
      newSocket.on('console', (data) => {
        // Update console output in real-time
        // This will be handled by the ConsoleOutput component
      });

      // Listen for server status updates
      newSocket.on('status-update', (data) => {
        dispatch(updateServerStatus({ serverId: id, status: data.status }));
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [id, dispatch]);

  // Update server name when currentServer changes
  useEffect(() => {
    if (currentServer) {
      setServerName(currentServer.name);
    }
  }, [currentServer]);

  // Auto-scroll console to bottom
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentServer?.consoleOutput]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleStartServer = () => {
    if (id) {
      dispatch(startServer(id));
    }
  };

  const handleStopServer = () => {
    if (id && window.confirm('Are you sure you want to stop the server?')) {
      dispatch(stopServer(id));
    }
  };

  const handleDeleteServer = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDeleteServer = () => {
    if (id) {
      dispatch(deleteServer(id))
        .unwrap()
        .then(() => {
          dispatch(setAlert({ 
            id: Date.now(), 
            msg: 'Server deleted successfully', 
            alertType: 'success' 
          }));
          navigate('/');
        });
    }
    setDeleteDialogOpen(false);
  };

  const handleSaveName = () => {
    // TODO: Implement server name update
    setIsEditing(false);
  };

  const handleSendCommand = (command) => {
    if (socket && id) {
      socket.emit('command', { serverId: id, command });
    }
  };

  if (loading || !currentServer) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center">
          {isEditing ? (
            <Box display="flex" alignItems="center">
              <TextField
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
                size="small"
                sx={{ mr: 1 }}
              />
              <IconButton color="primary" onClick={handleSaveName}>
                <Save />
              </IconButton>
              <IconButton onClick={() => setIsEditing(false)}>
                <Close />
              </IconButton>
            </Box>
          ) : (
            <Box display="flex" alignItems="center">
              <Typography variant="h4" component="h1" sx={{ mr: 2 }}>
                {currentServer.name}
              </Typography>
              <IconButton size="small" onClick={() => setIsEditing(true)}>
                <Edit fontSize="small" />
              </IconButton>
            </Box>
          )}
          <Box ml={2}>
            <ServerStatusChip status={currentServer.status} />
          </Box>
        </Box>
        
        <Box>
          {currentServer.status === 'running' ? (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<Stop />}
              onClick={handleStopServer}
              sx={{ mr: 2 }}
            >
              Stop Server
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              startIcon={<PlayArrow />}
              onClick={handleStartServer}
              disabled={currentServer.status === 'starting' || currentServer.status === 'stopping'}
              sx={{ mr: 2 }}
            >
              {currentServer.status === 'starting' ? 'Starting...' : 'Start Server'}
            </Button>
          )}
          
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={handleDeleteServer}
            disabled={currentServer.status === 'running'}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Console" />
        <Tab label="Players" />
        <Tab label="Server Properties" />
        <Tab label="Plugins" />
        <Tab label="Files" />
        <Tab label="Backups" />
      </Tabs>

      <Divider />

      <TabPanel value={tabValue} index={0}>
        <ConsoleOutput 
          serverId={id} 
          consoleOutput={currentServer.consoleOutput || []} 
          onSendCommand={handleSendCommand}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <ServerPlayers serverId={id} />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <ServerProperties serverId={id} />
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Typography>Plugins management will be available soon.</Typography>
      </TabPanel>

      <TabPanel value={tabValue} index={4}>
        <Typography>File manager will be available soon.</Typography>
      </TabPanel>

      <TabPanel value={tabValue} index={5}>
        <Typography>Backup management will be available soon.</Typography>
      </TabPanel>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Server</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this server? This action cannot be undone and all server data will be permanently removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteServer} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Server;
