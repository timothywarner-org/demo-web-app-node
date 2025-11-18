/**
 * Robot Routes
 * Defines API endpoints for robot operations
 */

const express = require('express');
const router = express.Router();
const robotController = require('../controllers/robotController');

/**
 * @route   GET /api/v1/robots
 * @desc    Get all robots with optional filtering
 * @access  Public
 * @query   status, type, batteryLevelMin, batteryLevelMax, limit, offset
 */
router.get('/', robotController.getAllRobots);

/**
 * @route   GET /api/v1/robots/statistics
 * @desc    Get robot fleet statistics
 * @access  Public
 */
router.get('/statistics', robotController.getStatistics);

/**
 * @route   POST /api/v1/robots/reset
 * @desc    Reset database to initial state
 * @access  Public
 */
router.post('/reset', robotController.resetDatabase);

/**
 * @route   GET /api/v1/robots/:id
 * @desc    Get robot by ID
 * @access  Public
 */
router.get('/:id', robotController.getRobotById);

/**
 * @route   POST /api/v1/robots
 * @desc    Create a new robot
 * @access  Public
 */
router.post('/', robotController.createRobot);

/**
 * @route   PUT /api/v1/robots/:id
 * @desc    Update robot by ID
 * @access  Public
 */
router.put('/:id', robotController.updateRobot);

/**
 * @route   DELETE /api/v1/robots/:id
 * @desc    Delete robot by ID
 * @access  Public
 */
router.delete('/:id', robotController.deleteRobot);

module.exports = router;
