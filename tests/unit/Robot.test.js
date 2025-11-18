/**
 * Robot Model Unit Tests
 */

const Robot = require('../../src/models/Robot');

describe('Robot Model', () => {
  describe('Constructor', () => {
    test('should create a robot with required fields', () => {
      const robotData = {
        name: 'TestBot-01',
        type: 'industrial'
      };

      const robot = new Robot(robotData);

      expect(robot.name).toBe('TestBot-01');
      expect(robot.type).toBe('industrial');
      expect(robot.id).toBeDefined();
      expect(robot.status).toBe('offline');
      expect(robot.batteryLevel).toBe(100);
    });

    test('should create a robot with all fields', () => {
      const robotData = {
        name: 'TestBot-02',
        type: 'logistics',
        status: 'active',
        batteryLevel: 75,
        location: { x: 10, y: 20, z: 5 },
        assignedTask: 'Transport',
        capabilities: ['navigation', 'load-carrying']
      };

      const robot = new Robot(robotData);

      expect(robot.name).toBe('TestBot-02');
      expect(robot.type).toBe('logistics');
      expect(robot.status).toBe('active');
      expect(robot.batteryLevel).toBe(75);
      expect(robot.location).toEqual({ x: 10, y: 20, z: 5 });
      expect(robot.assignedTask).toBe('Transport');
      expect(robot.capabilities).toContain('navigation');
    });

    test('should generate unique IDs for different robots', () => {
      const robot1 = new Robot({ name: 'Bot1', type: 'industrial' });
      const robot2 = new Robot({ name: 'Bot2', type: 'logistics' });

      expect(robot1.id).not.toBe(robot2.id);
    });
  });

  describe('update()', () => {
    test('should update allowed fields', () => {
      const robot = new Robot({ name: 'TestBot', type: 'industrial' });
      const originalUpdatedAt = robot.updatedAt;

      // Wait a bit to ensure timestamp changes
      setTimeout(() => {
        robot.update({
          name: 'UpdatedBot',
          status: 'active',
          batteryLevel: 50
        });

        expect(robot.name).toBe('UpdatedBot');
        expect(robot.status).toBe('active');
        expect(robot.batteryLevel).toBe(50);
        expect(robot.updatedAt).not.toBe(originalUpdatedAt);
      }, 10);
    });

    test('should not update id field', () => {
      const robot = new Robot({ name: 'TestBot', type: 'industrial' });
      const originalId = robot.id;

      robot.update({ id: 'new-id' });

      expect(robot.id).toBe(originalId);
    });

    test('should not update createdAt field', () => {
      const robot = new Robot({ name: 'TestBot', type: 'industrial' });
      const originalCreatedAt = robot.createdAt;

      robot.update({ createdAt: new Date().toISOString() });

      expect(robot.createdAt).toBe(originalCreatedAt);
    });
  });

  describe('needsMaintenance()', () => {
    test('should return true if last maintenance was over 30 days ago', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 31);

      const robot = new Robot({
        name: 'TestBot',
        type: 'industrial',
        lastMaintenance: oldDate.toISOString()
      });

      expect(robot.needsMaintenance()).toBe(true);
    });

    test('should return false if last maintenance was within 30 days', () => {
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 10);

      const robot = new Robot({
        name: 'TestBot',
        type: 'industrial',
        lastMaintenance: recentDate.toISOString()
      });

      expect(robot.needsMaintenance()).toBe(false);
    });
  });

  describe('isBatteryLow()', () => {
    test('should return true if battery level is below 20%', () => {
      const robot = new Robot({
        name: 'TestBot',
        type: 'industrial',
        batteryLevel: 15
      });

      expect(robot.isBatteryLow()).toBe(true);
    });

    test('should return false if battery level is 20% or above', () => {
      const robot = new Robot({
        name: 'TestBot',
        type: 'industrial',
        batteryLevel: 50
      });

      expect(robot.isBatteryLow()).toBe(false);
    });

    test('should return false for battery level exactly at 20%', () => {
      const robot = new Robot({
        name: 'TestBot',
        type: 'industrial',
        batteryLevel: 20
      });

      expect(robot.isBatteryLow()).toBe(false);
    });
  });

  describe('toJSON()', () => {
    test('should return complete JSON representation', () => {
      const robot = new Robot({
        name: 'TestBot',
        type: 'industrial',
        status: 'active',
        batteryLevel: 85
      });

      const json = robot.toJSON();

      expect(json).toHaveProperty('id');
      expect(json).toHaveProperty('name', 'TestBot');
      expect(json).toHaveProperty('type', 'industrial');
      expect(json).toHaveProperty('status', 'active');
      expect(json).toHaveProperty('batteryLevel', 85);
      expect(json).toHaveProperty('needsMaintenance');
      expect(json).toHaveProperty('isBatteryLow');
      expect(json).toHaveProperty('createdAt');
      expect(json).toHaveProperty('updatedAt');
    });

    test('should include computed properties', () => {
      const robot = new Robot({
        name: 'TestBot',
        type: 'industrial',
        batteryLevel: 10
      });

      const json = robot.toJSON();

      expect(json.isBatteryLow).toBe(true);
      expect(typeof json.needsMaintenance).toBe('boolean');
    });
  });
});
