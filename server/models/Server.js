const mongoose = require('mongoose');

const ServerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  version: {
    type: String,
    required: true
  },
  port: {
    type: Number,
    required: true,
    unique: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['stopped', 'starting', 'running', 'stopping', 'error'],
    default: 'stopped'
  },
  path: {
    type: String,
    required: true
  },
  plugins: [{
    name: String,
    version: String,
    enabled: {
      type: Boolean,
      default: true
    }
  }],
  properties: {
    type: Map,
    of: String,
    default: {}
  },
  maxPlayers: {
    type: Number,
    default: 20
  },
  motd: {
    type: String,
    default: 'A Minecraft Server'
  },
  whitelist: [{
    type: String,
    trim: true
  }],
  ops: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastStarted: Date,
  lastStopped: Date
});

module.exports = mongoose.model('Server', ServerSchema);
