/**
 * Validation Schemas
 * Uses Joi for request validation
 */

const Joi = require('joi');

const robotSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  type: Joi.string().valid('industrial', 'logistics', 'inspection', 'research', 'medical', 'agricultural').required(),
  status: Joi.string().valid('active', 'inactive', 'charging', 'maintenance', 'offline').default('offline'),
  batteryLevel: Joi.number().min(0).max(100).default(100),
  location: Joi.object({
    x: Joi.number().required(),
    y: Joi.number().required(),
    z: Joi.number().required()
  }).default({ x: 0, y: 0, z: 0 }),
  assignedTask: Joi.string().allow(null).default(null),
  capabilities: Joi.array().items(Joi.string()).default([]),
  manufacturingDate: Joi.date().iso().default(() => new Date()),
  lastMaintenance: Joi.date().iso().default(() => new Date())
});

const robotUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(50),
  type: Joi.string().valid('industrial', 'logistics', 'inspection', 'research', 'medical', 'agricultural'),
  status: Joi.string().valid('active', 'inactive', 'charging', 'maintenance', 'offline'),
  batteryLevel: Joi.number().min(0).max(100),
  location: Joi.object({
    x: Joi.number().required(),
    y: Joi.number().required(),
    z: Joi.number().required()
  }),
  assignedTask: Joi.string().allow(null),
  capabilities: Joi.array().items(Joi.string()),
  lastMaintenance: Joi.date().iso()
}).min(1); // At least one field must be provided

const querySchema = Joi.object({
  status: Joi.string().valid('active', 'inactive', 'charging', 'maintenance', 'offline'),
  type: Joi.string().valid('industrial', 'logistics', 'inspection', 'research', 'medical', 'agricultural'),
  batteryLevelMin: Joi.number().min(0).max(100),
  batteryLevelMax: Joi.number().min(0).max(100),
  limit: Joi.number().min(1).max(100).default(10),
  offset: Joi.number().min(0).default(0)
});

module.exports = {
  robotSchema,
  robotUpdateSchema,
  querySchema
};
