import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createServer, clearServerError } from '../features/servers/serverSlice';
import { setAlert } from '../features/alert/alertSlice';
import { Container, Typography, TextField, Button, Paper, Box, MenuItem, Grid, FormControl, InputLabel, Select, FormHelperText } from '@mui/material';
import { styled } from '@mui/material/styles';

// Available Minecraft versions
const MINECRAFT_VERSIONS = [
  '1.20.1', '1.20', '1.19.4', '1.19.3', '1.19.2', '1.19.1', '1.19',
  '1.18.2', '1.18.1', '1.18', '1.17.1', '1.17', '1.16.5', '1.16.4',
  '1.16.3', '1.16.2', '1.16.1', '1.16', '1.15.2', '1.15.1', '1.15',
  '1.14.4', '1.14.3', '1.14.2', '1.14.1', '1.14', '1.13.2', '1.13.1',
  '1.13', '1.12.2', '1.12.1', '1.12', '1.11.2', '1.11.1', '1.11',
  '1.10.2', '1.10.1', '1.10', '1.9.4', '1.9.3', '1.9.2', '1.9.1', '1.9',
  '1.8.9', '1.8.8', '1.8.7', '1.8.6', '1.8.5', '1.8.4', '1.8.3', '1.8.2', '1.8.1', '1.8'
];

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(4),
}));

const StyledForm = styled('form')(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

const CreateServer = () => {
  const [formData, setFormData] = useState({
    name: '',
    version: MINECRAFT_VERSIONS[0],
    serverType: 'vanilla',
    memory: '2048',
  });

  const { name, version, serverType, memory } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.servers);

  useEffect(() => {
    if (error) {
      dispatch(setAlert({ id: Date.now(), msg: error, alertType: 'error' }));
      dispatch(clearServerError());
    }
  }, [error, dispatch]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(createServer({ name, version }))
      .unwrap()
      .then(() => {
        dispatch(setAlert({ 
          id: Date.now(), 
          msg: 'Server created successfully', 
          alertType: 'success' 
        }));
        navigate('/');
      })
      .catch((err) => {
        // Error handling is done in the useEffect
      });
  };

  return (
    <Container maxWidth="md">
      <StyledPaper elevation={3}>
        <Typography component="h1" variant="h4" gutterBottom>
          Create a New Server
        </Typography>
        
        <StyledForm onSubmit={onSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                id="name"
                name="name"
                label="Server Name"
                value={name}
                onChange={onChange}
                margin="normal"
                variant="outlined"
                helperText="Choose a name for your server"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined" margin="normal" required>
                <InputLabel id="version-label">Minecraft Version</InputLabel>
                <Select
                  labelId="version-label"
                  id="version"
                  name="version"
                  value={version}
                  onChange={onChange}
                  label="Minecraft Version"
                >
                  {MINECRAFT_VERSIONS.map((ver) => (
                    <MenuItem key={ver} value={ver}>
                      {ver}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Select the Minecraft version</FormHelperText>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel id="server-type-label">Server Type</InputLabel>
                <Select
                  labelId="server-type-label"
                  id="serverType"
                  name="serverType"
                  value={serverType}
                  onChange={onChange}
                  label="Server Type"
                >
                  <MenuItem value="vanilla">Vanilla</MenuItem>
                  <MenuItem value="spigot" disabled>Spigot (Coming Soon)</MenuItem>
                  <MenuItem value="paper" disabled>Paper (Coming Soon)</MenuItem>
                  <MenuItem value="forge" disabled>Forge (Coming Soon)</MenuItem>
                </Select>
                <FormHelperText>Select the server software</FormHelperText>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel id="memory-label">Memory Allocation (MB)</InputLabel>
                <Select
                  labelId="memory-label"
                  id="memory"
                  name="memory"
                  value={memory}
                  onChange={onChange}
                  label="Memory Allocation (MB)"
                >
                  <MenuItem value="1024">1 GB (1024 MB)</MenuItem>
                  <MenuItem value="2048">2 GB (2048 MB) - Recommended</MenuItem>
                  <MenuItem value="3072">3 GB (3072 MB)</MenuItem>
                  <MenuItem value="4096">4 GB (4096 MB)</MenuItem>
                  <MenuItem value="5120">5 GB (5120 MB)</MenuItem>
                  <MenuItem value="6144">6 GB (6144 MB)</MenuItem>
                  <MenuItem value="8192">8 GB (8192 MB)</MenuItem>
                </Select>
                <FormHelperText>More memory allows for more players and plugins</FormHelperText>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Box mt={3} display="flex" justifyContent="flex-end">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate('/')}
                  sx={{ mr: 2 }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Server'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </StyledForm>
      </StyledPaper>
    </Container>
  );
};

export default CreateServer;
