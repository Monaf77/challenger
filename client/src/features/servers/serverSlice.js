import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const getServers = createAsyncThunk(
  'servers/getServers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/api/servers');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getServer = createAsyncThunk(
  'servers/getServer',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/servers/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const createServer = createAsyncThunk(
  'servers/createServer',
  async ({ name, version }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const body = JSON.stringify({ name, version });
      const res = await axios.post('/api/servers', body, config);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const startServer = createAsyncThunk(
  'servers/startServer',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.post(`/api/servers/${id}/start`);
      return { id, ...res.data };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const stopServer = createAsyncThunk(
  'servers/stopServer',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.post(`/api/servers/${id}/stop`);
      return { id, ...res.data };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteServer = createAsyncThunk(
  'servers/deleteServer',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/servers/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  servers: [],
  currentServer: null,
  loading: false,
  error: null,
};

const serverSlice = createSlice({
  name: 'servers',
  initialState,
  reducers: {
    clearServerError: (state) => {
      state.error = null;
    },
    setCurrentServer: (state, action) => {
      state.currentServer = action.payload;
    },
    updateServerStatus: (state, action) => {
      const { serverId, status } = action.payload;
      const server = state.servers.find((s) => s._id === serverId);
      if (server) {
        server.status = status;
      }
      if (state.currentServer && state.currentServer._id === serverId) {
        state.currentServer.status = status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Servers
      .addCase(getServers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getServers.fulfilled, (state, action) => {
        state.loading = false;
        state.servers = action.payload;
      })
      .addCase(getServers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch servers';
      })
      // Get Server
      .addCase(getServer.pending, (state) => {
        state.loading = true;
      })
      .addCase(getServer.fulfilled, (state, action) => {
        state.loading = false;
        state.currentServer = action.payload;
      })
      .addCase(getServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch server';
      })
      // Create Server
      .addCase(createServer.pending, (state) => {
        state.loading = true;
      })
      .addCase(createServer.fulfilled, (state, action) => {
        state.loading = false;
        state.servers.push(action.payload);
      })
      .addCase(createServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create server';
      })
      // Start Server
      .addCase(startServer.fulfilled, (state, action) => {
        const server = state.servers.find((s) => s._id === action.payload.id);
        if (server) {
          server.status = 'starting';
        }
        if (state.currentServer && state.currentServer._id === action.payload.id) {
          state.currentServer.status = 'starting';
        }
      })
      .addCase(startServer.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to start server';
      })
      // Stop Server
      .addCase(stopServer.fulfilled, (state, action) => {
        const server = state.servers.find((s) => s._id === action.payload.id);
        if (server) {
          server.status = 'stopping';
        }
        if (state.currentServer && state.currentServer._id === action.payload.id) {
          state.currentServer.status = 'stopping';
        }
      })
      .addCase(stopServer.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to stop server';
      })
      // Delete Server
      .addCase(deleteServer.fulfilled, (state, action) => {
        state.servers = state.servers.filter((s) => s._id !== action.payload);
        if (state.currentServer && state.currentServer._id === action.payload) {
          state.currentServer = null;
        }
      })
      .addCase(deleteServer.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to delete server';
      });
  },
});

export const { clearServerError, setCurrentServer, updateServerStatus } = serverSlice.actions;

export default serverSlice.reducer;
