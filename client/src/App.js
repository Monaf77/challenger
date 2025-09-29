import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';
import { io } from 'socket.io-client';

// Redux
import store from './store';

// Components
import PrivateRoute from './components/routing/PrivateRoute';
import Navbar from './components/layout/Navbar';
import Alert from './components/layout/Alert';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Server from './pages/Server';
import CreateServer from './pages/CreateServer';
import NotFound from './pages/NotFound';

// Utils
import setAuthToken from './utils/setAuthToken';

// Socket.IO
const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');

// Set theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7289da',
    },
    secondary: {
      main: '#99aab5',
    },
    background: {
      default: '#2f3136',
      paper: '#36393f',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});

// Check for token in localStorage
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={3}>
          <Router>
            <CssBaseline />
            <div className="app">
              <Navbar />
              <Alert />
              <main className="container">
                <Routes>
                  <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/servers/create" element={<PrivateRoute><CreateServer /></PrivateRoute>} />
                  <Route path="/servers/:id" element={<PrivateRoute><Server socket={socket} /></PrivateRoute>} />
                  <Route path="/404" element={<NotFound />} />
                  <Route path="*" element={<Navigate to="/404" />} />
                </Routes>
              </main>
            </div>
          </Router>
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
