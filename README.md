# Globomantics Robotics API

A comprehensive RESTful API for managing Globomantics' robotic fleet operations. This Node.js/Express application provides endpoints for robot management, fleet statistics, and maintenance tracking.

## Overview

The Globomantics Robotics API is designed for educational purposes as part of a Pluralsight course **"Getting Started with CircleCI"**. It demonstrates best practices in:

- RESTful API design
- Request validation with Joi
- Unit and integration testing with Jest
- Test reporting in JUnit format
- CI/CD with CircleCI and GitHub Actions
- Security best practices with Helmet
- Comprehensive API documentation
- Modern front-end development with vanilla JavaScript

## Features

### Web Dashboard

A beautiful, modern web dashboard is included for easy fleet management:

- **Visual Robot Cards**: Colorful cards displaying robot status, battery level, and capabilities
- **Real-time Statistics**: Live dashboard showing fleet health metrics
- **Full CRUD Interface**: Add, edit, view details, and delete robots through an intuitive UI
- **Smart Filtering**: Search by name, filter by status and type
- **Grid/List Views**: Toggle between card grid and list view
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Toast Notifications**: User-friendly success/error notifications
- **No Framework Dependencies**: Built with vanilla HTML, CSS, and JavaScript

**Access the dashboard**: Open `http://localhost:3000` in your browser after starting the server.

### API Features

- **CRUD Operations**: Create, Read, Update, and Delete robots via REST API
- **Advanced Filtering**: Filter robots by status, type, and battery level
- **Pagination**: Efficient data retrieval with customizable limits and offsets
- **Fleet Statistics**: Real-time statistics on robot fleet health and status
- **Maintenance Tracking**: Automatic detection of robots needing maintenance
- **Battery Monitoring**: Track battery levels and identify low-battery robots
- **Validation**: Comprehensive input validation for all endpoints
- **Error Handling**: Centralized error handling with meaningful messages
- **Health Checks**: Built-in health check endpoint for monitoring
- **CORS Support**: Cross-Origin Resource Sharing enabled
- **Security Headers**: Helmet.js for security best practices

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Web Dashboard](#web-dashboard)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [CI/CD](#cicd)
- [Project Structure](#project-structure)
- [Robot Types](#robot-types)
- [Robot Statuses](#robot-statuses)
- [Development](#development)
- [License](#license)

## Installation

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Setup

1. Clone the repository:
```bash
git clone https://github.com/your-org/globomantics-robotics-api.git
cd globomantics-robotics-api
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables (see [Configuration](#configuration))

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# CORS Configuration
CORS_ORIGIN=*

# Feature Flags
FEATURE_ADVANCED_DIAGNOSTICS=true
FEATURE_AI_INTEGRATION=false
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Application environment (development, production, test) | `development` |
| `PORT` | Server port | `3000` |
| `CORS_ORIGIN` | Allowed CORS origins | `*` |
| `FEATURE_ADVANCED_DIAGNOSTICS` | Enable advanced diagnostics | `false` |
| `FEATURE_AI_INTEGRATION` | Enable AI integration features | `false` |

## Running the Application

### Development Mode

Start the server with auto-reload on file changes:

```bash
npm run dev
```

### Production Mode

Start the server in production mode:

```bash
npm start
```

### Accessing the Application

Once the server is running:

- **Web Dashboard**: `http://localhost:3000` - Interactive fleet management interface
- **API Endpoints**: `http://localhost:3000/api/v1/robots` - REST API
- **API Info**: `http://localhost:3000/api` - API documentation links
- **Health Check**: `http://localhost:3000/health` - Service health status

The dashboard provides a user-friendly interface for all CRUD operations, perfect for demonstrating the API in action!

## Web Dashboard

The Globomantics Robotics Dashboard is a modern, responsive web interface built with vanilla JavaScript for managing your robot fleet.

### Dashboard Features

#### 1. Fleet Statistics Overview
At the top of the dashboard, you'll find real-time statistics cards displaying:
- **Total Robots**: Total number of robots in your fleet
- **Active Robots**: Currently operational robots
- **Average Battery Level**: Fleet-wide battery health
- **Maintenance Needed**: Robots requiring service

#### 2. Smart Filtering
Quickly find robots using multiple filter options:
- **Search by Name**: Real-time text search
- **Filter by Status**: active, inactive, charging, maintenance, offline
- **Filter by Type**: industrial, logistics, inspection, research, medical, agricultural
- **Reset Filters**: One-click filter reset

#### 3. Robot Management

**Add New Robot**
- Click the "Add Robot" button
- Fill in robot details (name, type, status, battery, location, capabilities)
- Real-time battery indicator shows current level
- Form validation ensures data integrity

**Edit Existing Robot**
- Click "Edit" on any robot card
- Modify any robot properties
- Changes are saved instantly to the API

**View Robot Details**
- Click "Details" to see complete robot information
- Includes manufacturing date, maintenance history, and all specifications
- Visual indicators for maintenance and battery status

**Delete Robot**
- Click "Delete" with confirmation dialog
- Permanent removal from the fleet

#### 4. View Options
Toggle between two view modes:
- **Grid View**: Colorful cards with visual emphasis (default)
- **List View**: Compact table-style layout

#### 5. Visual Indicators

**Status Colors**:
- 🟢 Active (Green)
- ⚫ Inactive (Gray)
- 🟡 Charging (Orange)
- 🔴 Maintenance (Red)
- ⚪ Offline (Dark Gray)

**Battery Levels**:
- Green: 50-100%
- Orange: 20-49%
- Red: 0-19% (Low battery warning)

**Maintenance Alerts**:
- Robots needing maintenance are clearly marked
- Based on 30-day maintenance cycle

### Using the Dashboard

1. **Start the server**:
   ```bash
   npm start
   ```

2. **Open your browser**:
   ```
   http://localhost:3000
   ```

3. **Explore the interface**:
   - View the 5 pre-loaded sample robots
   - Try filtering by status or type
   - Add a new robot using the form
   - Edit robot properties
   - View detailed information
   - Delete a robot (don't worry, you can reset!)

4. **Perfect for demonstrations**:
   - Great for showing CI/CD pipeline results
   - Visual feedback for API operations
   - Easy to understand for non-technical audiences
   - Professional appearance for course content

### Technology Stack

The dashboard is intentionally built with **vanilla JavaScript** (no frameworks) to:
- Keep the codebase simple and educational
- Minimize dependencies and build complexity
- Make it easy to understand for learners
- Focus on core web development concepts

**Technologies used**:
- HTML5 for structure
- CSS3 with modern features (Grid, Flexbox, CSS Variables)
- Vanilla JavaScript (ES6+)
- Fetch API for HTTP requests
- No build tools required

## API Endpoints

### Base URL

```
http://localhost:3000/api/v1
```

### Root & Health

#### GET /

Get API information and available endpoints.

**Response:**
```json
{
  "message": "Welcome to Globomantics Robotics API",
  "version": "1.0.0",
  "endpoints": {
    "health": "/health",
    "robots": "/api/v1/robots",
    "documentation": "/docs"
  }
}
```

#### GET /health

Check API health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-11-18T12:00:00.000Z",
  "service": "Globomantics Robotics API",
  "version": "1.0.0"
}
```

### Robots

#### GET /api/v1/robots

Get all robots with optional filtering and pagination.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status (active, inactive, charging, maintenance, offline) |
| `type` | string | Filter by type (industrial, logistics, inspection, research, medical, agricultural) |
| `batteryLevelMin` | number | Minimum battery level (0-100) |
| `batteryLevelMax` | number | Maximum battery level (0-100) |
| `limit` | number | Number of results per page (1-100, default: 10) |
| `offset` | number | Number of results to skip (default: 0) |

**Example Request:**
```bash
curl "http://localhost:3000/api/v1/robots?status=active&limit=5"
```

**Example Response:**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Atlas-01",
      "type": "industrial",
      "status": "active",
      "batteryLevel": 85,
      "location": { "x": 10, "y": 20, "z": 0 },
      "assignedTask": "Assembly Line A",
      "capabilities": ["welding", "assembly", "quality-check"],
      "manufacturingDate": "2023-01-15T00:00:00.000Z",
      "lastMaintenance": "2024-10-01T00:00:00.000Z",
      "needsMaintenance": false,
      "isBatteryLow": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 5,
    "limit": 10,
    "offset": 0,
    "hasMore": false
  }
}
```

#### GET /api/v1/robots/:id

Get a specific robot by ID.

**Example Request:**
```bash
curl "http://localhost:3000/api/v1/robots/550e8400-e29b-41d4-a716-446655440000"
```

**Example Response:**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Atlas-01",
    "type": "industrial",
    "status": "active",
    "batteryLevel": 85,
    "location": { "x": 10, "y": 20, "z": 0 },
    "assignedTask": "Assembly Line A",
    "capabilities": ["welding", "assembly", "quality-check"],
    "manufacturingDate": "2023-01-15T00:00:00.000Z",
    "lastMaintenance": "2024-10-01T00:00:00.000Z",
    "needsMaintenance": false,
    "isBatteryLow": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST /api/v1/robots

Create a new robot.

**Request Body:**
```json
{
  "name": "Titan-06",
  "type": "industrial",
  "status": "offline",
  "batteryLevel": 100,
  "location": { "x": 0, "y": 0, "z": 0 },
  "assignedTask": null,
  "capabilities": ["welding", "cutting", "assembly"]
}
```

**Required Fields:**
- `name` (string, 3-50 characters)
- `type` (string, one of: industrial, logistics, inspection, research, medical, agricultural)

**Optional Fields:**
- `status` (string, default: offline)
- `batteryLevel` (number 0-100, default: 100)
- `location` (object, default: {x: 0, y: 0, z: 0})
- `assignedTask` (string or null, default: null)
- `capabilities` (array of strings, default: [])
- `manufacturingDate` (ISO date string)
- `lastMaintenance` (ISO date string)

**Example Request:**
```bash
curl -X POST "http://localhost:3000/api/v1/robots" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Titan-06",
    "type": "industrial",
    "capabilities": ["welding", "cutting"]
  }'
```

**Example Response:**
```json
{
  "message": "Robot created successfully",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Titan-06",
    "type": "industrial",
    "status": "offline",
    "batteryLevel": 100,
    "location": { "x": 0, "y": 0, "z": 0 },
    "assignedTask": null,
    "capabilities": ["welding", "cutting"],
    "manufacturingDate": "2024-11-18T00:00:00.000Z",
    "lastMaintenance": "2024-11-18T00:00:00.000Z",
    "needsMaintenance": false,
    "isBatteryLow": false,
    "createdAt": "2024-11-18T12:00:00.000Z",
    "updatedAt": "2024-11-18T12:00:00.000Z"
  }
}
```

#### PUT /api/v1/robots/:id

Update an existing robot.

**Request Body** (at least one field required):
```json
{
  "name": "Atlas-01-Updated",
  "status": "maintenance",
  "batteryLevel": 50,
  "location": { "x": 15, "y": 25, "z": 1 },
  "assignedTask": "Maintenance Bay 3"
}
```

**Example Request:**
```bash
curl -X PUT "http://localhost:3000/api/v1/robots/550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "maintenance",
    "batteryLevel": 50
  }'
```

**Example Response:**
```json
{
  "message": "Robot updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Atlas-01",
    "type": "industrial",
    "status": "maintenance",
    "batteryLevel": 50,
    "location": { "x": 10, "y": 20, "z": 0 },
    "assignedTask": "Assembly Line A",
    "capabilities": ["welding", "assembly", "quality-check"],
    "manufacturingDate": "2023-01-15T00:00:00.000Z",
    "lastMaintenance": "2024-10-01T00:00:00.000Z",
    "needsMaintenance": false,
    "isBatteryLow": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-11-18T12:00:00.000Z"
  }
}
```

#### DELETE /api/v1/robots/:id

Delete a robot.

**Example Request:**
```bash
curl -X DELETE "http://localhost:3000/api/v1/robots/550e8400-e29b-41d4-a716-446655440000"
```

**Example Response:**
```json
{
  "message": "Robot deleted successfully"
}
```

#### GET /api/v1/robots/statistics

Get fleet statistics.

**Example Request:**
```bash
curl "http://localhost:3000/api/v1/robots/statistics"
```

**Example Response:**
```json
{
  "data": {
    "totalRobots": 5,
    "averageBatteryLevel": 74,
    "statusBreakdown": {
      "active": 3,
      "charging": 1,
      "maintenance": 1
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

#### POST /api/v1/robots/reset

Reset the database to initial state with sample data.

**Example Request:**
```bash
curl -X POST "http://localhost:3000/api/v1/robots/reset"
```

**Example Response:**
```json
{
  "message": "Database reset successfully",
  "data": {
    "totalRobots": 5
  }
}
```

## Testing

The project includes comprehensive unit and integration tests using Jest.

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Tests with JUnit Reporter (for CI)

```bash
npm run test:ci
```

This generates:
- Console output
- Coverage reports in `/coverage`
- JUnit XML report in `/test-results/junit.xml`

### Test Coverage

The project maintains a minimum coverage threshold of 70% for:
- Branches
- Functions
- Lines
- Statements

View coverage report:
```bash
npm test
# Coverage report is generated in ./coverage/lcov-report/index.html
```

### Test Structure

```
tests/
├── unit/                    # Unit tests
│   ├── Robot.test.js       # Robot model tests
│   └── RobotDatabase.test.js # Database tests
└── integration/            # Integration tests
    └── api.test.js        # API endpoint tests
```

## CI/CD

The project includes sample configurations for both CircleCI and GitHub Actions.

### CircleCI

Configuration: `.circleci/config.yml`

**Features:**
- Automated testing on every commit
- Test result reporting
- Code coverage tracking
- Multi-environment testing (Node 18, 20, 21)
- Artifact storage for test results

**Workflows:**
1. Build and Test
2. Code Coverage
3. Deploy (when applicable)

See `.circleci/README.md` for detailed CircleCI setup instructions.

### GitHub Actions

Configuration: `.github/workflows/`

**Available Workflows:**

1. **CI Workflow** (`.github/workflows/ci.yml`)
   - Runs on push and pull request
   - Tests on multiple Node versions
   - Uploads coverage reports

2. **Release Workflow** (`.github/workflows/release.yml`)
   - Creates releases on version tags
   - Publishes to npm (if configured)

3. **Code Quality** (`.github/workflows/code-quality.yml`)
   - Linting checks
   - Security audits
   - Dependency checks

See `.github/workflows/README.md` for detailed GitHub Actions setup instructions.

## Project Structure

```
globomantics-robotics-api/
├── .circleci/                # CircleCI configuration
│   ├── config.yml
│   └── README.md
├── .github/                  # GitHub Actions workflows
│   └── workflows/
│       ├── ci.yml
│       ├── release.yml
│       ├── code-quality.yml
│       └── README.md
├── public/                   # Front-end dashboard
│   ├── css/
│   │   └── styles.css       # Dashboard styling
│   ├── js/
│   │   └── app.js           # Dashboard JavaScript
│   └── index.html           # Main dashboard page
├── src/                      # Source code
│   ├── config/              # Configuration files
│   │   └── config.js
│   ├── controllers/         # Request handlers
│   │   └── robotController.js
│   ├── middleware/          # Express middleware
│   │   ├── errorHandler.js
│   │   └── notFoundHandler.js
│   ├── models/              # Data models
│   │   ├── Robot.js
│   │   └── RobotDatabase.js
│   ├── routes/              # API routes
│   │   └── robotRoutes.js
│   ├── utils/               # Utility functions
│   │   └── validators.js
│   ├── app.js               # Express app setup
│   └── server.js            # Server entry point
├── tests/                    # Test files
│   ├── integration/         # Integration tests
│   │   └── api.test.js
│   └── unit/                # Unit tests
│       ├── Robot.test.js
│       └── RobotDatabase.test.js
├── docs/                     # Additional documentation
│   └── API.md
├── coverage/                 # Test coverage reports (generated)
├── test-results/            # JUnit test results (generated)
├── .dockerignore            # Docker ignore rules
├── .env.example             # Example environment variables
├── .eslintrc.js             # ESLint configuration
├── .gitignore               # Git ignore rules
├── Dockerfile               # Docker container definition
├── package.json             # Project dependencies
├── README.md                # This file
└── LICENSE                  # MIT License
```

## Robot Types

The API supports the following robot types:

| Type | Description | Common Capabilities |
|------|-------------|-------------------|
| `industrial` | Heavy-duty manufacturing robots | welding, cutting, assembly, heavy-lifting |
| `logistics` | Warehouse and transport robots | navigation, load-carrying, obstacle-avoidance |
| `inspection` | Quality control and safety inspection | thermal-imaging, photography, gas-detection |
| `research` | Scientific research and data collection | sampling, data-analysis, autonomous-navigation |
| `medical` | Healthcare and medical assistance | surgery-assistance, diagnostics, patient-care |
| `agricultural` | Farming and crop management | planting, harvesting, soil-analysis |

## Robot Statuses

Robots can have the following statuses:

| Status | Description |
|--------|-------------|
| `active` | Robot is operational and performing tasks |
| `inactive` | Robot is not currently in use but ready |
| `charging` | Robot is charging its battery |
| `maintenance` | Robot is undergoing maintenance or repairs |
| `offline` | Robot is powered off or disconnected |

## Development

### Code Style

The project uses ESLint for code linting. Run the linter:

```bash
npm run lint
```

Auto-fix linting issues:

```bash
npm run lint:fix
```

### Adding New Features

1. Create feature branch: `git checkout -b feature/your-feature`
2. Implement changes in `/src`
3. Add tests in `/tests`
4. Ensure tests pass: `npm test`
5. Run linter: `npm run lint`
6. Commit changes with descriptive message
7. Push and create pull request

### Database Reset

The API uses an in-memory database that resets on server restart. To reset during runtime:

```bash
curl -X POST http://localhost:3000/api/v1/robots/reset
```

## API Client Examples

### JavaScript (Node.js)

```javascript
const axios = require('axios');

const API_URL = 'http://localhost:3000/api/v1';

// Get all robots
async function getAllRobots() {
  const response = await axios.get(`${API_URL}/robots`);
  console.log(response.data);
}

// Create a robot
async function createRobot() {
  const robot = {
    name: 'NewBot-01',
    type: 'logistics',
    capabilities: ['navigation', 'load-carrying']
  };
  const response = await axios.post(`${API_URL}/robots`, robot);
  console.log(response.data);
}

// Update a robot
async function updateRobot(id) {
  const updates = { status: 'active', batteryLevel: 95 };
  const response = await axios.put(`${API_URL}/robots/${id}`, updates);
  console.log(response.data);
}

getAllRobots();
```

### Python

```python
import requests

API_URL = 'http://localhost:3000/api/v1'

# Get all robots
def get_all_robots():
    response = requests.get(f'{API_URL}/robots')
    print(response.json())

# Create a robot
def create_robot():
    robot = {
        'name': 'NewBot-01',
        'type': 'logistics',
        'capabilities': ['navigation', 'load-carrying']
    }
    response = requests.post(f'{API_URL}/robots', json=robot)
    print(response.json())

# Update a robot
def update_robot(robot_id):
    updates = {'status': 'active', 'batteryLevel': 95}
    response = requests.put(f'{API_URL}/robots/{robot_id}', json=updates)
    print(response.json())

get_all_robots()
```

### cURL Examples

```bash
# Get all active robots
curl "http://localhost:3000/api/v1/robots?status=active"

# Get robots with low battery
curl "http://localhost:3000/api/v1/robots?batteryLevelMax=20"

# Create a robot
curl -X POST "http://localhost:3000/api/v1/robots" \
  -H "Content-Type: application/json" \
  -d '{"name": "NewBot", "type": "industrial"}'

# Update robot status
curl -X PUT "http://localhost:3000/api/v1/robots/ROBOT_ID" \
  -H "Content-Type: application/json" \
  -d '{"status": "maintenance"}'

# Get statistics
curl "http://localhost:3000/api/v1/robots/statistics"
```

## Error Responses

The API returns consistent error responses:

### 400 Bad Request

```json
{
  "error": "Validation Error",
  "details": [
    "\"name\" length must be at least 3 characters long",
    "\"type\" must be one of [industrial, logistics, inspection, research, medical, agricultural]"
  ]
}
```

### 404 Not Found

```json
{
  "error": "Not Found",
  "message": "Robot with ID 550e8400-e29b-41d4-a716-446655440000 not found"
}
```

### 500 Internal Server Error

```json
{
  "error": "Error",
  "message": "Internal Server Error"
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues, questions, or contributions, please:
- Open an issue on GitHub
- Contact the development team
- Check the documentation in `/docs`

## Acknowledgments

- Built for Pluralsight course content
- Designed to demonstrate modern Node.js API development
- Example project for CI/CD best practices

---

**Globomantics Robotics** - Powering the future of automation
