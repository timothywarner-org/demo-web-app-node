/**
 * Robot Model
 * Represents a robot in the Globomantics fleet
 */

const { v4: uuidv4 } = require('uuid');

class Robot {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.name = data.name;
    this.type = data.type;
    this.status = data.status || 'offline';
    this.batteryLevel = data.batteryLevel || 100;
    this.location = data.location || { x: 0, y: 0, z: 0 };
    this.assignedTask = data.assignedTask || null;
    this.capabilities = data.capabilities || [];
    this.manufacturingDate = data.manufacturingDate || new Date().toISOString();
    this.lastMaintenance = data.lastMaintenance || new Date().toISOString();
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  /**
   * Update robot properties
   * @param {Object} updates - Object containing properties to update
   */
  update(updates) {
    const allowedUpdates = [
      'name', 'type', 'status', 'batteryLevel',
      'location', 'assignedTask', 'capabilities', 'lastMaintenance'
    ];

    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        this[key] = updates[key];
      }
    });

    this.updatedAt = new Date().toISOString();
  }

  /**
   * Check if robot needs maintenance
   * @returns {boolean}
   */
  needsMaintenance() {
    const maintenanceDate = new Date(this.lastMaintenance);
    const daysSinceMaintenance = (Date.now() - maintenanceDate) / (1000 * 60 * 60 * 24);
    return daysSinceMaintenance > 30; // Maintenance needed every 30 days
  }

  /**
   * Check if robot battery is low
   * @returns {boolean}
   */
  isBatteryLow() {
    return this.batteryLevel < 20;
  }

  /**
   * Convert robot to JSON representation
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      status: this.status,
      batteryLevel: this.batteryLevel,
      location: this.location,
      assignedTask: this.assignedTask,
      capabilities: this.capabilities,
      manufacturingDate: this.manufacturingDate,
      lastMaintenance: this.lastMaintenance,
      needsMaintenance: this.needsMaintenance(),
      isBatteryLow: this.isBatteryLow(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Robot;
