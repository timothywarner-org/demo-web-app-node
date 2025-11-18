/**
 * Robot Database Unit Tests
 */

const RobotDatabase = require('../../src/models/RobotDatabase');
const Robot = require('../../src/models/Robot');

describe('Robot Database', () => {
  beforeEach(() => {
    // Reset database before each test
    RobotDatabase.reset();
  });

  describe('initializeSampleData()', () => {
    test('should initialize with 5 sample robots', () => {
      expect(RobotDatabase.count()).toBe(5);
    });

    test('should initialize with valid robot objects', () => {
      const robots = RobotDatabase.findAll();
      expect(robots.length).toBe(5);
      robots.forEach(robot => {
        expect(robot).toBeInstanceOf(Robot);
        expect(robot.id).toBeDefined();
        expect(robot.name).toBeDefined();
        expect(robot.type).toBeDefined();
      });
    });
  });

  describe('findAll()', () => {
    test('should return all robots without filters', () => {
      const robots = RobotDatabase.findAll();
      expect(robots.length).toBe(5);
    });

    test('should filter robots by status', () => {
      const activeRobots = RobotDatabase.findAll({ status: 'active' });
      activeRobots.forEach(robot => {
        expect(robot.status).toBe('active');
      });
    });

    test('should filter robots by type', () => {
      const industrialRobots = RobotDatabase.findAll({ type: 'industrial' });
      industrialRobots.forEach(robot => {
        expect(robot.type).toBe('industrial');
      });
    });

    test('should filter robots by minimum battery level', () => {
      const robots = RobotDatabase.findAll({ batteryLevelMin: 50 });
      robots.forEach(robot => {
        expect(robot.batteryLevel).toBeGreaterThanOrEqual(50);
      });
    });

    test('should filter robots by maximum battery level', () => {
      const robots = RobotDatabase.findAll({ batteryLevelMax: 50 });
      robots.forEach(robot => {
        expect(robot.batteryLevel).toBeLessThanOrEqual(50);
      });
    });

    test('should apply multiple filters', () => {
      const robots = RobotDatabase.findAll({
        status: 'active',
        batteryLevelMin: 50
      });
      robots.forEach(robot => {
        expect(robot.status).toBe('active');
        expect(robot.batteryLevel).toBeGreaterThanOrEqual(50);
      });
    });
  });

  describe('findById()', () => {
    test('should find robot by valid ID', () => {
      const allRobots = RobotDatabase.findAll();
      const targetRobot = allRobots[0];

      const foundRobot = RobotDatabase.findById(targetRobot.id);

      expect(foundRobot).toBeDefined();
      expect(foundRobot.id).toBe(targetRobot.id);
      expect(foundRobot.name).toBe(targetRobot.name);
    });

    test('should return null for invalid ID', () => {
      const robot = RobotDatabase.findById('invalid-id');
      expect(robot).toBeNull();
    });
  });

  describe('create()', () => {
    test('should create a new robot', () => {
      const initialCount = RobotDatabase.count();
      const newRobotData = {
        name: 'NewBot',
        type: 'logistics',
        status: 'active'
      };

      const robot = RobotDatabase.create(newRobotData);

      expect(robot).toBeInstanceOf(Robot);
      expect(robot.name).toBe('NewBot');
      expect(robot.type).toBe('logistics');
      expect(RobotDatabase.count()).toBe(initialCount + 1);
    });

    test('should assign unique ID to new robot', () => {
      const robot1 = RobotDatabase.create({ name: 'Bot1', type: 'industrial' });
      const robot2 = RobotDatabase.create({ name: 'Bot2', type: 'logistics' });

      expect(robot1.id).not.toBe(robot2.id);
    });
  });

  describe('update()', () => {
    test('should update existing robot', () => {
      const allRobots = RobotDatabase.findAll();
      const targetRobot = allRobots[0];

      const updated = RobotDatabase.update(targetRobot.id, {
        name: 'UpdatedName',
        status: 'maintenance'
      });

      expect(updated).toBeDefined();
      expect(updated.name).toBe('UpdatedName');
      expect(updated.status).toBe('maintenance');
    });

    test('should return null for invalid ID', () => {
      const result = RobotDatabase.update('invalid-id', { name: 'NewName' });
      expect(result).toBeNull();
    });

    test('should update timestamps on update', () => {
      const allRobots = RobotDatabase.findAll();
      const targetRobot = allRobots[0];
      const originalUpdatedAt = targetRobot.updatedAt;

      setTimeout(() => {
        RobotDatabase.update(targetRobot.id, { status: 'active' });
        const updatedRobot = RobotDatabase.findById(targetRobot.id);
        expect(updatedRobot.updatedAt).not.toBe(originalUpdatedAt);
      }, 10);
    });
  });

  describe('delete()', () => {
    test('should delete existing robot', () => {
      const initialCount = RobotDatabase.count();
      const allRobots = RobotDatabase.findAll();
      const targetRobot = allRobots[0];

      const deleted = RobotDatabase.delete(targetRobot.id);

      expect(deleted).toBe(true);
      expect(RobotDatabase.count()).toBe(initialCount - 1);
      expect(RobotDatabase.findById(targetRobot.id)).toBeNull();
    });

    test('should return false for invalid ID', () => {
      const deleted = RobotDatabase.delete('invalid-id');
      expect(deleted).toBe(false);
    });
  });

  describe('count()', () => {
    test('should return correct count', () => {
      expect(RobotDatabase.count()).toBe(5);

      RobotDatabase.create({ name: 'NewBot', type: 'industrial' });
      expect(RobotDatabase.count()).toBe(6);

      const robots = RobotDatabase.findAll();
      RobotDatabase.delete(robots[0].id);
      expect(RobotDatabase.count()).toBe(5);
    });
  });

  describe('getStatistics()', () => {
    test('should return statistics object', () => {
      const stats = RobotDatabase.getStatistics();

      expect(stats).toHaveProperty('totalRobots');
      expect(stats).toHaveProperty('averageBatteryLevel');
      expect(stats).toHaveProperty('statusBreakdown');
      expect(stats).toHaveProperty('typeBreakdown');
      expect(stats).toHaveProperty('robotsNeedingMaintenance');
      expect(stats).toHaveProperty('robotsWithLowBattery');
    });

    test('should calculate correct total robots', () => {
      const stats = RobotDatabase.getStatistics();
      expect(stats.totalRobots).toBe(5);
    });

    test('should calculate average battery level', () => {
      const stats = RobotDatabase.getStatistics();
      expect(stats.averageBatteryLevel).toBeGreaterThan(0);
      expect(stats.averageBatteryLevel).toBeLessThanOrEqual(100);
    });

    test('should provide status breakdown', () => {
      const stats = RobotDatabase.getStatistics();
      expect(typeof stats.statusBreakdown).toBe('object');
      expect(Object.keys(stats.statusBreakdown).length).toBeGreaterThan(0);
    });

    test('should provide type breakdown', () => {
      const stats = RobotDatabase.getStatistics();
      expect(typeof stats.typeBreakdown).toBe('object');
      expect(Object.keys(stats.typeBreakdown).length).toBeGreaterThan(0);
    });
  });

  describe('reset()', () => {
    test('should reset database to initial state', () => {
      // Modify database
      RobotDatabase.create({ name: 'TempBot', type: 'industrial' });
      const robots = RobotDatabase.findAll();
      RobotDatabase.delete(robots[0].id);

      // Reset
      RobotDatabase.reset();

      expect(RobotDatabase.count()).toBe(5);
    });

    test('should clear all custom robots after reset', () => {
      const customRobot = RobotDatabase.create({ name: 'CustomBot', type: 'industrial' });

      RobotDatabase.reset();

      expect(RobotDatabase.findById(customRobot.id)).toBeNull();
    });
  });
});
