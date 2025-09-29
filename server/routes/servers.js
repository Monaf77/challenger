const express = require('express');
const { check } = require('express-validator');
const { protect } = require('../middleware/auth');
const {
  createServer,
  getServers,
  getServer,
  startServer,
  stopServer,
  deleteServer,
} = require('../controllers/servers');

const router = express.Router();

// Apply protect middleware to all routes
router.use(protect);

// @route   POST /api/servers
// @desc    Create a new server
// @access  Private
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('version', 'Version is required').not().isEmpty()
  ],
  createServer
);

// @route   GET /api/servers
// @desc    Get all user's servers
// @access  Private
router.get('/', getServers);

// @route   GET /api/servers/:id
// @desc    Get server by ID
// @access  Private
router.get('/:id', getServer);

// @route   POST /api/servers/:id/start
// @desc    Start a server
// @access  Private
router.post('/:id/start', startServer);

// @route   POST /api/servers/:id/stop
// @desc    Stop a server
// @access  Private
router.post('/:id/stop', stopServer);

// @route   DELETE /api/servers/:id
// @desc    Delete a server
// @access  Private
router.delete('/:id', deleteServer);

module.exports = router;
