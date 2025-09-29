import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getServers } from '../features/servers/serverSlice';
import { Container, Typography, Button, Grid, Card, CardContent, CardActions, Box, CircularProgress, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import ServerStatusChip from '../components/servers/ServerStatusChip';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { servers, loading } = useSelector((state) => state.servers);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // تحميل السيرفرات حتى بدون تسجيل الدخول للاختبار
    dispatch(getServers());
  }, [dispatch, user]);

  // تعطيل شاشة التحميل للاختبار
  // if (loading && !servers) {
  if (false) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Servers
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={Link}
          to="/servers/create"
        >
          Create Server
        </Button>
      </Box>

      {servers && servers.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No servers found
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            Get started by creating a new Minecraft server.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/servers/create"
            startIcon={<AddIcon />}
          >
            Create Server
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {servers &&
            servers.map((server) => (
              <Grid item key={server._id} xs={12} sm={6} md={4}>
                <StyledCard>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {server.name}
                      </Typography>
                      <ServerStatusChip status={server.status} />
                    </Box>
                    <Typography variant="body2" color="textSecondary" component="p" gutterBottom>
                      Version: {server.version}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                      Port: {server.port}
                    </Typography>
                    {server.players && (
                      <Typography variant="body2" color="textSecondary" component="p">
                        Players: {server.players.online}/{server.players.max}
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      size="small"
                      color="primary"
                      component={Link}
                      to={`/servers/${server._id}`}
                    >
                      Manage
                    </Button>
                    {server.status === 'running' ? (
                      <Button
                        size="small"
                        color="secondary"
                        onClick={() => {
                          // Handle stop server
                        }}
                      >
                        Stop
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        color="primary"
                        variant="outlined"
                        onClick={() => {
                          // Handle start server
                        }}
                      >
                        Start
                      </Button>
                    )}
                  </CardActions>
                </StyledCard>
              </Grid>
            ))}
        </Grid>
      )}
    </Container>
  );
};

export default Dashboard;
