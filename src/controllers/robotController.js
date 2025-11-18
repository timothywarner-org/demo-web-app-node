/**
 * Robot Controller
 * Handles business logic for robot operations
 */

const robotDb = require('../models/RobotDatabase');
const { robotSchema, robotUpdateSchema, querySchema } = require('../utils/validators');

class RobotController {
  /**
   * Get all robots with optional filtering and pagination
   */
  async getAllRobots(req, res, next) {
    try {
      // Validate query parameters
      const { error, value } = querySchema.validate(req.query);
      if (error) {
        return res.status(400).json({
          error: 'Validation Error',
          details: error.details.map(d => d.message)
        });
      }

      const { limit, offset, ...filters } = value;
      const allRobots = robotDb.findAll(filters);

      // Pagination
      const paginatedRobots = allRobots.slice(offset, offset + limit);

      res.json({
        data: paginatedRobots.map(r => r.toJSON()),
        pagination: {
          total: allRobots.length,
          limit,
          offset,
          hasMore: offset + limit < allRobots.length
        }
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get robot by ID
   */
  async getRobotById(req, res, next) {
    try {
      const robot = robotDb.findById(req.params.id);

      if (!robot) {
        return res.status(404).json({
          error: 'Not Found',
          message: `Robot with ID ${req.params.id} not found`
        });
      }

      res.json({ data: robot.toJSON() });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Create a new robot
   */
  async createRobot(req, res, next) {
    try {
      // Validate request body
      const { error, value } = robotSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          error: 'Validation Error',
          details: error.details.map(d => d.message)
        });
      }

      const robot = robotDb.create(value);

      res.status(201).json({
        message: 'Robot created successfully',
        data: robot.toJSON()
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Update robot by ID
   */
  async updateRobot(req, res, next) {
    try {
      // Validate request body
      const { error, value } = robotUpdateSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          error: 'Validation Error',
          details: error.details.map(d => d.message)
        });
      }

      const robot = robotDb.update(req.params.id, value);

      if (!robot) {
        return res.status(404).json({
          error: 'Not Found',
          message: `Robot with ID ${req.params.id} not found`
        });
      }

      res.json({
        message: 'Robot updated successfully',
        data: robot.toJSON()
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Delete robot by ID
   */
  async deleteRobot(req, res, next) {
    try {
      const deleted = robotDb.delete(req.params.id);

      if (!deleted) {
        return res.status(404).json({
          error: 'Not Found',
          message: `Robot with ID ${req.params.id} not found`
        });
      }

      res.json({
        message: 'Robot deleted successfully'
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get robot statistics
   */
  async getStatistics(req, res, next) {
    try {
      const stats = robotDb.getStatistics();
      res.json({ data: stats });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Reset database to initial state
   */
  async resetDatabase(req, res, next) {
    try {
      robotDb.reset();
      res.json({
        message: 'Database reset successfully',
        data: {
          totalRobots: robotDb.count()
        }
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new RobotController();
