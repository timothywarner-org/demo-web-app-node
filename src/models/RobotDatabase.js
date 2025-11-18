/**
 * Robot Database (In-Memory)
 * Simulates a database for robot storage and retrieval
 */

const Robot = require('./Robot');

class RobotDatabase {
  constructor() {
    this.robots = new Map();
    this.initializeSampleData();
  }

  /**
   * Initialize database with sample robots
   */
  initializeSampleData() {
    const sampleRobots = [
      {
        name: 'Atlas-01',
        type: 'industrial',
        status: 'active',
        batteryLevel: 85,
        location: { x: 10, y: 20, z: 0 },
        assignedTask: 'Assembly Line A',
        capabilities: ['welding', 'assembly', 'quality-check'],
        manufacturingDate: '2023-01-15T00:00:00.000Z',
        lastMaintenance: '2024-10-01T00:00:00.000Z'
      },
      {
        name: 'Mercury-02',
        type: 'logistics',
        status: 'active',
        batteryLevel: 92,
        location: { x: 45, y: 30, z: 0 },
        assignedTask: 'Warehouse Transport',
        capabilities: ['navigation', 'load-carrying', 'obstacle-avoidance'],
        manufacturingDate: '2023-03-20T00:00:00.000Z',
        lastMaintenance: '2024-11-01T00:00:00.000Z'
      },
      {
        name: 'Scout-03',
        type: 'inspection',
        status: 'charging',
        batteryLevel: 15,
        location: { x: 5, y: 5, z: 0 },
        assignedTask: null,
        capabilities: ['thermal-imaging', 'photography', 'gas-detection'],
        manufacturingDate: '2023-06-10T00:00:00.000Z',
        lastMaintenance: '2024-09-15T00:00:00.000Z'
      },
      {
        name: 'Titan-04',
        type: 'industrial',
        status: 'maintenance',
        batteryLevel: 100,
        location: { x: 0, y: 0, z: 0 },
        assignedTask: null,
        capabilities: ['heavy-lifting', 'welding', 'cutting'],
        manufacturingDate: '2022-11-05T00:00:00.000Z',
        lastMaintenance: '2024-08-20T00:00:00.000Z'
      },
      {
        name: 'Voyager-05',
        type: 'research',
        status: 'active',
        batteryLevel: 78,
        location: { x: 100, y: 150, z: 2 },
        assignedTask: 'Environmental Sampling',
        capabilities: ['sampling', 'data-analysis', 'autonomous-navigation'],
        manufacturingDate: '2023-09-01T00:00:00.000Z',
        lastMaintenance: '2024-11-10T00:00:00.000Z'
      }
    ];

    sampleRobots.forEach(robotData => {
      const robot = new Robot(robotData);
      this.robots.set(robot.id, robot);
    });
  }

  /**
   * Get all robots with optional filtering
   * @param {Object} filters - Filter criteria
   * @returns {Array<Robot>}
   */
  findAll(filters = {}) {
    let robots = Array.from(this.robots.values());

    // Apply filters
    if (filters.status) {
      robots = robots.filter(r => r.status === filters.status);
    }
    if (filters.type) {
      robots = robots.filter(r => r.type === filters.type);
    }
    if (filters.batteryLevelMin) {
      robots = robots.filter(r => r.batteryLevel >= parseInt(filters.batteryLevelMin));
    }
    if (filters.batteryLevelMax) {
      robots = robots.filter(r => r.batteryLevel <= parseInt(filters.batteryLevelMax));
    }

    return robots;
  }

  /**
   * Find robot by ID
   * @param {string} id - Robot ID
   * @returns {Robot|null}
   */
  findById(id) {
    return this.robots.get(id) || null;
  }

  /**
   * Create a new robot
   * @param {Object} robotData - Robot data
   * @returns {Robot}
   */
  create(robotData) {
    const robot = new Robot(robotData);
    this.robots.set(robot.id, robot);
    return robot;
  }

  /**
   * Update a robot
   * @param {string} id - Robot ID
   * @param {Object} updates - Update data
   * @returns {Robot|null}
   */
  update(id, updates) {
    const robot = this.robots.get(id);
    if (!robot) return null;

    robot.update(updates);
    return robot;
  }

  /**
   * Delete a robot
   * @param {string} id - Robot ID
   * @returns {boolean}
   */
  delete(id) {
    return this.robots.delete(id);
  }

  /**
   * Get total count of robots
   * @returns {number}
   */
  count() {
    return this.robots.size;
  }

  /**
   * Get statistics about robots
   * @returns {Object}
   */
  getStatistics() {
    const robots = Array.from(this.robots.values());
    const statuses = {};
    const types = {};
    let totalBatteryLevel = 0;

    robots.forEach(robot => {
      // Count by status
      statuses[robot.status] = (statuses[robot.status] || 0) + 1;
      // Count by type
      types[robot.type] = (types[robot.type] || 0) + 1;
      // Sum battery levels
      totalBatteryLevel += robot.batteryLevel;
    });

    return {
      totalRobots: robots.length,
      averageBatteryLevel: robots.length > 0 ? Math.round(totalBatteryLevel / robots.length) : 0,
      statusBreakdown: statuses,
      typeBreakdown: types,
      robotsNeedingMaintenance: robots.filter(r => r.needsMaintenance()).length,
      robotsWithLowBattery: robots.filter(r => r.isBatteryLow()).length
    };
  }

  /**
   * Reset database to initial state
   */
  reset() {
    this.robots.clear();
    this.initializeSampleData();
  }
}

// Singleton instance
const database = new RobotDatabase();

module.exports = database;
