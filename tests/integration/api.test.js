/**
 * API Integration Tests
 */

const request = require('supertest');
const app = require('../../src/app');
const robotDb = require('../../src/models/RobotDatabase');

describe('Globomantics Robotics API', () => {
  beforeEach(() => {
    // Reset database before each test
    robotDb.reset();
  });

  describe('GET /', () => {
    test('should return welcome message', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('endpoints');
    });
  });

  describe('GET /health', () => {
    test('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('service');
    });
  });

  describe('GET /api/v1/robots', () => {
    test('should return all robots', async () => {
      const response = await request(app)
        .get('/api/v1/robots')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    test('should filter robots by status', async () => {
      const response = await request(app)
        .get('/api/v1/robots?status=active')
        .expect(200);

      response.body.data.forEach(robot => {
        expect(robot.status).toBe('active');
      });
    });

    test('should filter robots by type', async () => {
      const response = await request(app)
        .get('/api/v1/robots?type=industrial')
        .expect(200);

      response.body.data.forEach(robot => {
        expect(robot.type).toBe('industrial');
      });
    });

    test('should support pagination', async () => {
      const response = await request(app)
        .get('/api/v1/robots?limit=2&offset=0')
        .expect(200);

      expect(response.body.data.length).toBeLessThanOrEqual(2);
      expect(response.body.pagination.limit).toBe(2);
      expect(response.body.pagination.offset).toBe(0);
    });

    test('should return 400 for invalid query parameters', async () => {
      const response = await request(app)
        .get('/api/v1/robots?status=invalid-status')
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/v1/robots/:id', () => {
    test('should return robot by ID', async () => {
      const robots = robotDb.findAll();
      const targetRobot = robots[0];

      const response = await request(app)
        .get(`/api/v1/robots/${targetRobot.id}`)
        .expect(200);

      expect(response.body.data.id).toBe(targetRobot.id);
      expect(response.body.data.name).toBe(targetRobot.name);
    });

    test('should return 404 for non-existent robot', async () => {
      const response = await request(app)
        .get('/api/v1/robots/non-existent-id')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Not Found');
    });
  });

  describe('POST /api/v1/robots', () => {
    test('should create a new robot', async () => {
      const newRobot = {
        name: 'TestBot-New',
        type: 'logistics',
        status: 'active',
        batteryLevel: 90,
        capabilities: ['navigation', 'load-carrying']
      };

      const response = await request(app)
        .post('/api/v1/robots')
        .send(newRobot)
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body.data.name).toBe('TestBot-New');
      expect(response.body.data.type).toBe('logistics');
      expect(response.body.data).toHaveProperty('id');
    });

    test('should return 400 for invalid robot data', async () => {
      const invalidRobot = {
        name: 'TB', // Too short
        type: 'invalid-type'
      };

      const response = await request(app)
        .post('/api/v1/robots')
        .send(invalidRobot)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Validation Error');
    });

    test('should return 400 for missing required fields', async () => {
      const incompleteRobot = {
        name: 'TestBot'
        // Missing type
      };

      const response = await request(app)
        .post('/api/v1/robots')
        .send(incompleteRobot)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/v1/robots/:id', () => {
    test('should update an existing robot', async () => {
      const robots = robotDb.findAll();
      const targetRobot = robots[0];

      const updates = {
        name: 'UpdatedBot',
        status: 'maintenance',
        batteryLevel: 50
      };

      const response = await request(app)
        .put(`/api/v1/robots/${targetRobot.id}`)
        .send(updates)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.data.name).toBe('UpdatedBot');
      expect(response.body.data.status).toBe('maintenance');
      expect(response.body.data.batteryLevel).toBe(50);
    });

    test('should return 404 for non-existent robot', async () => {
      const updates = { name: 'UpdatedBot' };

      const response = await request(app)
        .put('/api/v1/robots/non-existent-id')
        .send(updates)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 for invalid update data', async () => {
      const robots = robotDb.findAll();
      const targetRobot = robots[0];

      const invalidUpdates = {
        type: 'invalid-type',
        batteryLevel: 150 // Over 100
      };

      const response = await request(app)
        .put(`/api/v1/robots/${targetRobot.id}`)
        .send(invalidUpdates)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 when no fields provided', async () => {
      const robots = robotDb.findAll();
      const targetRobot = robots[0];

      const response = await request(app)
        .put(`/api/v1/robots/${targetRobot.id}`)
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/v1/robots/:id', () => {
    test('should delete an existing robot', async () => {
      const robots = robotDb.findAll();
      const targetRobot = robots[0];
      const initialCount = robotDb.count();

      const response = await request(app)
        .delete(`/api/v1/robots/${targetRobot.id}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(robotDb.count()).toBe(initialCount - 1);
      expect(robotDb.findById(targetRobot.id)).toBeNull();
    });

    test('should return 404 for non-existent robot', async () => {
      const response = await request(app)
        .delete('/api/v1/robots/non-existent-id')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/v1/robots/statistics', () => {
    test('should return robot statistics', async () => {
      const response = await request(app)
        .get('/api/v1/robots/statistics')
        .expect(200);

      expect(response.body.data).toHaveProperty('totalRobots');
      expect(response.body.data).toHaveProperty('averageBatteryLevel');
      expect(response.body.data).toHaveProperty('statusBreakdown');
      expect(response.body.data).toHaveProperty('typeBreakdown');
      expect(response.body.data).toHaveProperty('robotsNeedingMaintenance');
      expect(response.body.data).toHaveProperty('robotsWithLowBattery');
    });

    test('should return correct statistics', async () => {
      const response = await request(app)
        .get('/api/v1/robots/statistics')
        .expect(200);

      expect(response.body.data.totalRobots).toBe(5);
      expect(typeof response.body.data.averageBatteryLevel).toBe('number');
    });
  });

  describe('POST /api/v1/robots/reset', () => {
    test('should reset database to initial state', async () => {
      // Modify database
      await request(app)
        .post('/api/v1/robots')
        .send({ name: 'TempBot', type: 'industrial' });

      // Reset
      const response = await request(app)
        .post('/api/v1/robots/reset')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.data.totalRobots).toBe(5);
    });
  });

  describe('404 Not Found', () => {
    test('should return 404 for unknown route', async () => {
      const response = await request(app)
        .get('/api/v1/unknown-route')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Not Found');
    });
  });
});
