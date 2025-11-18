# Globomantics Robotics API - Detailed Documentation

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Data Models](#data-models)
3. [API Endpoints Reference](#api-endpoints-reference)
4. [Error Handling](#error-handling)
5. [Authentication (Future)](#authentication-future)
6. [Rate Limiting (Future)](#rate-limiting-future)
7. [Versioning](#versioning)

## Architecture Overview

The Globomantics Robotics API follows a layered architecture pattern:

```
┌─────────────────────────────────────────┐
│          Client Applications            │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         Express Middleware              │
│  (CORS, Helmet, Morgan, Body Parser)    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│            Routes Layer                  │
│      (robotRoutes.js)                   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         Controllers Layer                │
│    (robotController.js)                 │
│  - Request Validation                   │
│  - Business Logic                       │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│          Models Layer                    │
│  - Robot.js (Entity)                    │
│  - RobotDatabase.js (Data Access)       │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│       In-Memory Database                │
│          (Map Storage)                   │
└─────────────────────────────────────────┘
```

### Key Components

#### 1. Server (`server.js`)
- Application entry point
- Starts HTTP server
- Handles graceful shutdown

#### 2. Application (`app.js`)
- Express application configuration
- Middleware setup
- Route registration
- Error handling

#### 3. Controllers
- Handle HTTP requests and responses
- Validate input using Joi schemas
- Implement business logic
- Format responses

#### 4. Models
- Define data structures
- Implement data operations
- Business logic methods

#### 5. Middleware
- Error handling
- 404 handling
- Security (Helmet)
- CORS
- Logging (Morgan)

## Data Models

### Robot Entity

```javascript
{
  id: string (UUID v4),
  name: string (3-50 chars),
  type: enum ['industrial', 'logistics', 'inspection', 'research', 'medical', 'agricultural'],
  status: enum ['active', 'inactive', 'charging', 'maintenance', 'offline'],
  batteryLevel: number (0-100),
  location: {
    x: number,
    y: number,
    z: number
  },
  assignedTask: string | null,
  capabilities: string[],
  manufacturingDate: ISO-8601 string,
  lastMaintenance: ISO-8601 string,
  createdAt: ISO-8601 string,
  updatedAt: ISO-8601 string
}
```

### Computed Properties

- `needsMaintenance`: boolean - Returns true if last maintenance was over 30 days ago
- `isBatteryLow`: boolean - Returns true if battery level is below 20%

### Robot Types

| Type | Use Case | Typical Capabilities |
|------|----------|---------------------|
| `industrial` | Manufacturing, assembly | welding, cutting, assembly, heavy-lifting, quality-check |
| `logistics` | Warehouse operations | navigation, load-carrying, obstacle-avoidance, sorting |
| `inspection` | Quality control, safety | thermal-imaging, photography, gas-detection, measurement |
| `research` | Scientific research | sampling, data-analysis, autonomous-navigation, recording |
| `medical` | Healthcare | surgery-assistance, diagnostics, patient-care, sterilization |
| `agricultural` | Farming operations | planting, harvesting, soil-analysis, irrigation |

### Robot Statuses

| Status | Description | Typical Use |
|--------|-------------|-------------|
| `active` | Performing assigned tasks | Normal operation |
| `inactive` | Idle but ready | Between tasks |
| `charging` | Battery charging | Low battery recovery |
| `maintenance` | Under repair/service | Scheduled or emergency maintenance |
| `offline` | Powered down | Storage, transport |

## API Endpoints Reference

### Base Information

- **Base URL**: `http://localhost:3000/api/v1`
- **Content-Type**: `application/json`
- **Response Format**: JSON

### Endpoint Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information |
| GET | `/health` | Health check |
| GET | `/api/v1/robots` | List all robots |
| GET | `/api/v1/robots/:id` | Get robot by ID |
| POST | `/api/v1/robots` | Create new robot |
| PUT | `/api/v1/robots/:id` | Update robot |
| DELETE | `/api/v1/robots/:id` | Delete robot |
| GET | `/api/v1/robots/statistics` | Fleet statistics |
| POST | `/api/v1/robots/reset` | Reset database |

### Detailed Endpoint Documentation

#### GET /api/v1/robots

**Purpose**: Retrieve a list of robots with optional filtering and pagination.

**Query Parameters**:

```
status (optional): Filter by status
  - Type: string
  - Valid values: active, inactive, charging, maintenance, offline
  - Example: ?status=active

type (optional): Filter by robot type
  - Type: string
  - Valid values: industrial, logistics, inspection, research, medical, agricultural
  - Example: ?type=industrial

batteryLevelMin (optional): Minimum battery level
  - Type: number
  - Range: 0-100
  - Example: ?batteryLevelMin=50

batteryLevelMax (optional): Maximum battery level
  - Type: number
  - Range: 0-100
  - Example: ?batteryLevelMax=20

limit (optional): Number of results
  - Type: number
  - Range: 1-100
  - Default: 10
  - Example: ?limit=25

offset (optional): Number of results to skip
  - Type: number
  - Minimum: 0
  - Default: 0
  - Example: ?offset=20
```

**Combining Filters**:

```bash
# Get active industrial robots with battery > 50%, show 5 results
curl "http://localhost:3000/api/v1/robots?status=active&type=industrial&batteryLevelMin=50&limit=5"
```

**Response Structure**:

```json
{
  "data": [/* Array of robot objects */],
  "pagination": {
    "total": 5,        // Total matching robots
    "limit": 10,       // Requested limit
    "offset": 0,       // Requested offset
    "hasMore": false   // More results available
  }
}
```

#### POST /api/v1/robots

**Purpose**: Create a new robot in the system.

**Request Body Schema**:

```json
{
  "name": "string (required, 3-50 chars)",
  "type": "string (required, one of the valid types)",
  "status": "string (optional, default: offline)",
  "batteryLevel": "number (optional, 0-100, default: 100)",
  "location": {
    "x": "number (optional, default: 0)",
    "y": "number (optional, default: 0)",
    "z": "number (optional, default: 0)"
  },
  "assignedTask": "string | null (optional, default: null)",
  "capabilities": ["array of strings (optional, default: [])"],
  "manufacturingDate": "ISO-8601 string (optional, default: current date)",
  "lastMaintenance": "ISO-8601 string (optional, default: current date)"
}
```

**Validation Rules**:

1. **name**:
   - Required
   - Minimum length: 3 characters
   - Maximum length: 50 characters

2. **type**:
   - Required
   - Must be one of: industrial, logistics, inspection, research, medical, agricultural

3. **status**:
   - Optional
   - Must be one of: active, inactive, charging, maintenance, offline
   - Default: offline

4. **batteryLevel**:
   - Optional
   - Must be a number between 0 and 100
   - Default: 100

5. **location**:
   - Optional
   - Must be an object with x, y, z numeric properties
   - Default: {x: 0, y: 0, z: 0}

6. **capabilities**:
   - Optional
   - Must be an array of strings
   - Default: []

**Example Requests**:

Minimal request:
```bash
curl -X POST "http://localhost:3000/api/v1/robots" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "QuickBot-01",
    "type": "logistics"
  }'
```

Full request:
```bash
curl -X POST "http://localhost:3000/api/v1/robots" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "AdvancedBot-01",
    "type": "industrial",
    "status": "active",
    "batteryLevel": 85,
    "location": {"x": 10, "y": 20, "z": 5},
    "assignedTask": "Assembly Line B",
    "capabilities": ["welding", "assembly", "quality-check"],
    "manufacturingDate": "2024-01-15T00:00:00.000Z",
    "lastMaintenance": "2024-11-01T00:00:00.000Z"
  }'
```

#### PUT /api/v1/robots/:id

**Purpose**: Update an existing robot's properties.

**URL Parameters**:
- `id`: Robot UUID (required)

**Request Body**: At least one field must be provided. All fields are optional but similar to POST validation.

**Updatable Fields**:
- name
- type
- status
- batteryLevel
- location
- assignedTask
- capabilities
- lastMaintenance

**Non-Updatable Fields**:
- id (immutable)
- createdAt (immutable)
- manufacturingDate (use lastMaintenance for tracking)

**Example - Update Status and Battery**:

```bash
curl -X PUT "http://localhost:3000/api/v1/robots/550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "charging",
    "batteryLevel": 15
  }'
```

**Example - Update Location and Task**:

```bash
curl -X PUT "http://localhost:3000/api/v1/robots/550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -d '{
    "location": {"x": 50, "y": 75, "z": 2},
    "assignedTask": "Warehouse Zone C"
  }'
```

#### GET /api/v1/robots/statistics

**Purpose**: Get comprehensive fleet statistics.

**No Parameters Required**

**Response Structure**:

```json
{
  "data": {
    "totalRobots": 5,
    "averageBatteryLevel": 74,
    "statusBreakdown": {
      "active": 3,
      "charging": 1,
      "maintenance": 1,
      "inactive": 0,
      "offline": 0
    },
    "typeBreakdown": {
      "industrial": 2,
      "logistics": 1,
      "inspection": 1,
      "research": 1
    },
    "robotsNeedingMaintenance": 1,
    "robotsWithLowBattery": 1
  }
}
```

**Use Cases**:

1. **Dashboard Display**: Show overall fleet health
2. **Maintenance Planning**: Identify robots needing service
3. **Resource Allocation**: Understand type distribution
4. **Battery Management**: Track charging needs

## Error Handling

### Error Response Format

All errors follow a consistent format:

```json
{
  "error": "Error Type",
  "message": "Human-readable error message",
  "details": ["Optional array of specific validation errors"]
}
```

### HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Validation errors, invalid input |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Unexpected server errors |

### Common Error Scenarios

#### 1. Validation Error (400)

```json
{
  "error": "Validation Error",
  "details": [
    "\"name\" length must be at least 3 characters long",
    "\"type\" must be one of [industrial, logistics, inspection, research, medical, agricultural]"
  ]
}
```

**Causes**:
- Missing required fields
- Invalid field types
- Values outside allowed ranges
- Invalid enum values

#### 2. Not Found (404)

```json
{
  "error": "Not Found",
  "message": "Robot with ID 550e8400-e29b-41d4-a716-446655440000 not found"
}
```

**Causes**:
- Robot ID doesn't exist
- Robot was deleted
- Invalid UUID format

#### 3. Route Not Found (404)

```json
{
  "error": "Not Found",
  "message": "Cannot GET /api/v1/invalid-route",
  "availableEndpoints": {
    "root": "/",
    "health": "/health",
    "robots": "/api/v1/robots",
    "robotById": "/api/v1/robots/:id",
    "statistics": "/api/v1/robots/statistics",
    "reset": "/api/v1/robots/reset"
  }
}
```

## Authentication (Future)

Currently, the API is open and doesn't require authentication. Future versions will include:

### Planned Authentication Methods

1. **API Keys**: For programmatic access
2. **JWT Tokens**: For user-based access
3. **OAuth 2.0**: For third-party integrations

### Example Future Header

```
Authorization: Bearer <token>
```

## Rate Limiting (Future)

Future versions will implement rate limiting:

- **Standard Tier**: 100 requests/minute
- **Premium Tier**: 1000 requests/minute
- **Enterprise Tier**: Unlimited

Response headers will include:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Timestamp when limit resets

## Versioning

### Current Version: v1

The API uses URL-based versioning:

```
/api/v1/robots
```

### Version Policy

- **Breaking Changes**: New major version (v2, v3, etc.)
- **New Features**: Same version, backward compatible
- **Bug Fixes**: Same version
- **Deprecation Notice**: 6 months minimum before version sunset

### Future Versions

Future versions will maintain backward compatibility where possible. Deprecated versions will be supported for at least 6 months after a new version release.

## Best Practices

### 1. Pagination

Always use pagination for list endpoints:

```bash
# Good
curl "http://localhost:3000/api/v1/robots?limit=20&offset=0"

# Bad (may return large datasets)
curl "http://localhost:3000/api/v1/robots"
```

### 2. Filtering

Use specific filters to reduce response size:

```bash
# Good - Get only what you need
curl "http://localhost:3000/api/v1/robots?status=active&type=industrial"

# Less efficient - Get everything then filter client-side
curl "http://localhost:3000/api/v1/robots"
```

### 3. Error Handling

Always check status codes and handle errors:

```javascript
try {
  const response = await axios.get('/api/v1/robots/invalid-id');
} catch (error) {
  if (error.response) {
    // Server responded with error
    console.log(error.response.status);
    console.log(error.response.data);
  } else if (error.request) {
    // No response received
    console.log('No response from server');
  } else {
    // Request setup error
    console.log('Error:', error.message);
  }
}
```

### 4. Idempotency

- **GET**: Always idempotent
- **PUT**: Idempotent (same update multiple times = same result)
- **DELETE**: Idempotent (deleting same ID multiple times)
- **POST**: Not idempotent (creates new resource each time)

## Testing the API

### Using cURL

See examples throughout this document.

### Using Postman

1. Import the collection (future: provide Postman collection)
2. Set base URL: `http://localhost:3000`
3. Execute requests

### Using JavaScript

See code examples in main README.md

### Using Python

See code examples in main README.md

## Performance Considerations

### Response Times

Expected response times (development):

- **GET** (single): < 10ms
- **GET** (list): < 50ms
- **POST**: < 20ms
- **PUT**: < 20ms
- **DELETE**: < 10ms

### Scalability

Current in-memory database is suitable for:

- Development
- Testing
- Small deployments (< 10,000 robots)

For production, consider:

- PostgreSQL for relational data
- MongoDB for flexible schemas
- Redis for caching

## Support and Feedback

For questions or issues:

1. Check this documentation
2. Review main README.md
3. Check existing GitHub issues
4. Open a new issue with:
   - API endpoint
   - Request details
   - Expected vs actual behavior
   - Error messages

---

**Last Updated**: November 2024
**API Version**: 1.0.0
**Documentation Version**: 1.0.0
