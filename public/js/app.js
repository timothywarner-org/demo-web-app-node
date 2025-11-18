/**
 * Globomantics Robotics - Fleet Management Dashboard
 * Front-end JavaScript Application
 */

// API Configuration
const API_BASE_URL = '/api/v1';

// State Management
let robots = [];
let filteredRobots = [];
let currentView = 'grid';
let editingRobotId = null;

// DOM Elements
const elements = {
  // Stats
  statTotal: document.getElementById('statTotal'),
  statActive: document.getElementById('statActive'),
  statBattery: document.getElementById('statBattery'),
  statMaintenance: document.getElementById('statMaintenance'),

  // Filters
  searchInput: document.getElementById('searchInput'),
  statusFilter: document.getElementById('statusFilter'),
  typeFilter: document.getElementById('typeFilter'),
  resetFiltersBtn: document.getElementById('resetFiltersBtn'),

  // Views
  robotsGrid: document.getElementById('robotsGrid'),
  loadingState: document.getElementById('loadingState'),
  emptyState: document.getElementById('emptyState'),
  gridViewBtn: document.getElementById('gridViewBtn'),
  listViewBtn: document.getElementById('listViewBtn'),

  // Buttons
  refreshBtn: document.getElementById('refreshBtn'),
  addRobotBtn: document.getElementById('addRobotBtn'),

  // Modal
  robotModal: document.getElementById('robotModal'),
  detailsModal: document.getElementById('detailsModal'),
  modalTitle: document.getElementById('modalTitle'),
  robotForm: document.getElementById('robotForm'),
  closeModalBtn: document.getElementById('closeModalBtn'),
  cancelBtn: document.getElementById('cancelBtn'),
  closeDetailsBtn: document.getElementById('closeDetailsBtn'),
  closeDetailsBtn2: document.getElementById('closeDetailsBtn2'),

  // Form fields
  robotId: document.getElementById('robotId'),
  robotName: document.getElementById('robotName'),
  robotType: document.getElementById('robotType'),
  robotStatus: document.getElementById('robotStatus'),
  robotBattery: document.getElementById('robotBattery'),
  robotTask: document.getElementById('robotTask'),
  locationX: document.getElementById('locationX'),
  locationY: document.getElementById('locationY'),
  locationZ: document.getElementById('locationZ'),
  robotCapabilities: document.getElementById('robotCapabilities'),
  batteryFill: document.getElementById('batteryFill'),

  // Toast
  toastContainer: document.getElementById('toastContainer')
};

// ===================================
// Initialization
// ===================================
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  setupEventListeners();
});

function initializeApp() {
  loadRobots();
  loadStatistics();
}

function setupEventListeners() {
  // Buttons
  elements.refreshBtn.addEventListener('click', () => {
    loadRobots();
    loadStatistics();
    showToast('Data refreshed', 'success');
  });

  elements.addRobotBtn.addEventListener('click', () => openAddModal());

  // Filters
  elements.searchInput.addEventListener('input', applyFilters);
  elements.statusFilter.addEventListener('change', applyFilters);
  elements.typeFilter.addEventListener('change', applyFilters);
  elements.resetFiltersBtn.addEventListener('click', resetFilters);

  // View toggle
  elements.gridViewBtn.addEventListener('click', () => setView('grid'));
  elements.listViewBtn.addEventListener('click', () => setView('list'));

  // Modal
  elements.closeModalBtn.addEventListener('click', closeModal);
  elements.cancelBtn.addEventListener('click', closeModal);
  elements.closeDetailsBtn.addEventListener('click', closeDetailsModal);
  elements.closeDetailsBtn2.addEventListener('click', closeDetailsModal);
  elements.robotModal.addEventListener('click', (e) => {
    if (e.target === elements.robotModal) {
      closeModal();
    }
  });

  // Form
  elements.robotForm.addEventListener('submit', handleFormSubmit);
  elements.robotBattery.addEventListener('input', updateBatteryIndicator);
}

// ===================================
// API Calls
// ===================================
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    showToast(error.message || 'An error occurred', 'error');
    throw error;
  }
}

async function loadRobots() {
  try {
    elements.loadingState.style.display = 'block';
    elements.robotsGrid.innerHTML = '';
    elements.emptyState.style.display = 'none';

    const data = await apiCall('/robots?limit=100');
    robots = data.data || [];
    filteredRobots = [...robots];

    renderRobots();
  } catch (error) {
    console.error('Failed to load robots:', error);
  } finally {
    elements.loadingState.style.display = 'none';
  }
}

async function loadStatistics() {
  try {
    const data = await apiCall('/robots/statistics');
    updateStatistics(data.data);
  } catch (error) {
    console.error('Failed to load statistics:', error);
  }
}

async function createRobot(robotData) {
  const data = await apiCall('/robots', {
    method: 'POST',
    body: JSON.stringify(robotData)
  });
  return data.data;
}

async function updateRobot(id, robotData) {
  const data = await apiCall(`/robots/${id}`, {
    method: 'PUT',
    body: JSON.stringify(robotData)
  });
  return data.data;
}

async function deleteRobot(id) {
  await apiCall(`/robots/${id}`, {
    method: 'DELETE'
  });
}

// ===================================
// Rendering
// ===================================
function renderRobots() {
  if (filteredRobots.length === 0) {
    elements.robotsGrid.innerHTML = '';
    elements.emptyState.style.display = 'block';
    return;
  }

  elements.emptyState.style.display = 'none';
  elements.robotsGrid.innerHTML = filteredRobots.map(robot => createRobotCard(robot)).join('');
}

function createRobotCard(robot) {
  const batteryClass = robot.batteryLevel < 20 ? 'low' : robot.batteryLevel < 50 ? 'medium' : '';
  const robotIcon = getRobotIcon(robot.type);

  return `
    <div class="robot-card">
      <div class="robot-header">
        <div>
          <div class="robot-icon">${robotIcon}</div>
          <h3 class="robot-name">${escapeHtml(robot.name)}</h3>
          <span class="robot-type">${robot.type}</span>
        </div>
        <div class="robot-status status-${robot.status}">
          <span class="status-dot"></span>
          ${robot.status}
        </div>
      </div>

      <div class="robot-info">
        ${robot.assignedTask ? `
          <div class="info-item">
            <span class="info-label">Task</span>
            <span class="info-value">${escapeHtml(robot.assignedTask)}</span>
          </div>
        ` : ''}
        <div class="info-item">
          <span class="info-label">Battery</span>
          <span class="info-value">${robot.batteryLevel}%</span>
        </div>
      </div>

      <div class="battery-bar">
        <div class="battery-fill ${batteryClass}" style="width: ${robot.batteryLevel}%"></div>
      </div>

      ${robot.capabilities && robot.capabilities.length > 0 ? `
        <div class="robot-capabilities">
          ${robot.capabilities.slice(0, 3).map(cap =>
            `<span class="capability-tag">${escapeHtml(cap)}</span>`
          ).join('')}
          ${robot.capabilities.length > 3 ?
            `<span class="capability-tag">+${robot.capabilities.length - 3} more</span>` : ''}
        </div>
      ` : ''}

      ${robot.needsMaintenance ? `
        <div class="info-item">
          <span class="info-label text-warning">⚠️ Maintenance Due</span>
        </div>
      ` : ''}

      <div class="robot-actions">
        <button class="btn btn-secondary btn-sm" onclick="viewRobotDetails('${robot.id}')">
          <span class="icon">👁️</span> Details
        </button>
        <button class="btn btn-primary btn-sm" onclick="editRobot('${robot.id}')">
          <span class="icon">✏️</span> Edit
        </button>
        <button class="btn btn-danger btn-sm" onclick="confirmDelete('${robot.id}', '${escapeHtml(robot.name)}')">
          <span class="icon">🗑️</span> Delete
        </button>
      </div>
    </div>
  `;
}

function updateStatistics(stats) {
  elements.statTotal.textContent = stats.totalRobots || 0;
  elements.statActive.textContent = stats.statusBreakdown?.active || 0;
  elements.statBattery.textContent = `${stats.averageBatteryLevel || 0}%`;
  elements.statMaintenance.textContent = stats.robotsNeedingMaintenance || 0;
}

// ===================================
// Filtering
// ===================================
function applyFilters() {
  const searchTerm = elements.searchInput.value.toLowerCase();
  const statusFilter = elements.statusFilter.value;
  const typeFilter = elements.typeFilter.value;

  filteredRobots = robots.filter(robot => {
    const matchesSearch = robot.name.toLowerCase().includes(searchTerm);
    const matchesStatus = !statusFilter || robot.status === statusFilter;
    const matchesType = !typeFilter || robot.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  renderRobots();
}

function resetFilters() {
  elements.searchInput.value = '';
  elements.statusFilter.value = '';
  elements.typeFilter.value = '';
  applyFilters();
  showToast('Filters reset', 'success');
}

// ===================================
// View Management
// ===================================
function setView(view) {
  currentView = view;

  if (view === 'grid') {
    elements.gridViewBtn.classList.add('active');
    elements.listViewBtn.classList.remove('active');
    elements.robotsGrid.classList.remove('list-view');
  } else {
    elements.listViewBtn.classList.add('active');
    elements.gridViewBtn.classList.remove('active');
    elements.robotsGrid.classList.add('list-view');
  }
}

// ===================================
// Modal Management
// ===================================
function openAddModal() {
  editingRobotId = null;
  elements.modalTitle.textContent = 'Add New Robot';
  elements.robotForm.reset();
  elements.robotId.value = '';
  elements.robotBattery.value = 100;
  updateBatteryIndicator();
  elements.robotModal.classList.add('show');
}

function editRobot(id) {
  const robot = robots.find(r => r.id === id);
  if (!robot) {
    return;
  }

  editingRobotId = id;
  elements.modalTitle.textContent = 'Edit Robot';

  // Populate form
  elements.robotId.value = robot.id;
  elements.robotName.value = robot.name;
  elements.robotType.value = robot.type;
  elements.robotStatus.value = robot.status;
  elements.robotBattery.value = robot.batteryLevel;
  elements.robotTask.value = robot.assignedTask || '';
  elements.locationX.value = robot.location.x;
  elements.locationY.value = robot.location.y;
  elements.locationZ.value = robot.location.z;
  elements.robotCapabilities.value = robot.capabilities.join(', ');

  updateBatteryIndicator();
  elements.robotModal.classList.add('show');
}

function closeModal() {
  elements.robotModal.classList.remove('show');
  elements.robotForm.reset();
  editingRobotId = null;
}

function viewRobotDetails(id) {
  const robot = robots.find(r => r.id === id);
  if (!robot) {
    return;
  }

  const detailsHTML = `
    <div class="detail-group">
      <h3>Basic Information</h3>
      <div class="detail-item">
        <span class="detail-label">ID</span>
        <span class="detail-value">${robot.id}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Name</span>
        <span class="detail-value">${escapeHtml(robot.name)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Type</span>
        <span class="detail-value">${robot.type}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Status</span>
        <span class="detail-value">
          <span class="robot-status status-${robot.status}">
            <span class="status-dot"></span>
            ${robot.status}
          </span>
        </span>
      </div>
    </div>

    <div class="detail-group">
      <h3>Operational Data</h3>
      <div class="detail-item">
        <span class="detail-label">Battery Level</span>
        <span class="detail-value">${robot.batteryLevel}%</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Assigned Task</span>
        <span class="detail-value">${robot.assignedTask || 'None'}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Location</span>
        <span class="detail-value">X: ${robot.location.x}, Y: ${robot.location.y}, Z: ${robot.location.z}</span>
      </div>
    </div>

    <div class="detail-group">
      <h3>Capabilities</h3>
      <div class="robot-capabilities">
        ${robot.capabilities.map(cap =>
          `<span class="capability-tag">${escapeHtml(cap)}</span>`
        ).join('')}
      </div>
    </div>

    <div class="detail-group">
      <h3>Maintenance</h3>
      <div class="detail-item">
        <span class="detail-label">Manufacturing Date</span>
        <span class="detail-value">${formatDate(robot.manufacturingDate)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Last Maintenance</span>
        <span class="detail-value">${formatDate(robot.lastMaintenance)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Needs Maintenance</span>
        <span class="detail-value ${robot.needsMaintenance ? 'text-danger' : 'text-success'}">
          ${robot.needsMaintenance ? '⚠️ Yes' : '✅ No'}
        </span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Battery Low</span>
        <span class="detail-value ${robot.isBatteryLow ? 'text-danger' : 'text-success'}">
          ${robot.isBatteryLow ? '⚠️ Yes' : '✅ No'}
        </span>
      </div>
    </div>

    <div class="detail-group">
      <h3>Timestamps</h3>
      <div class="detail-item">
        <span class="detail-label">Created</span>
        <span class="detail-value">${formatDate(robot.createdAt)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Last Updated</span>
        <span class="detail-value">${formatDate(robot.updatedAt)}</span>
      </div>
    </div>
  `;

  document.getElementById('robotDetails').innerHTML = detailsHTML;
  elements.detailsModal.classList.add('show');
}

function closeDetailsModal() {
  elements.detailsModal.classList.remove('show');
}

// ===================================
// Form Handling
// ===================================
async function handleFormSubmit(e) {
  e.preventDefault();

  const robotData = {
    name: elements.robotName.value.trim(),
    type: elements.robotType.value,
    status: elements.robotStatus.value,
    batteryLevel: parseInt(elements.robotBattery.value),
    assignedTask: elements.robotTask.value.trim() || null,
    location: {
      x: parseFloat(elements.locationX.value) || 0,
      y: parseFloat(elements.locationY.value) || 0,
      z: parseFloat(elements.locationZ.value) || 0
    },
    capabilities: elements.robotCapabilities.value
      .split(',')
      .map(c => c.trim())
      .filter(c => c.length > 0)
  };

  try {
    if (editingRobotId) {
      await updateRobot(editingRobotId, robotData);
      showToast(`Robot "${robotData.name}" updated successfully`, 'success');
    } else {
      await createRobot(robotData);
      showToast(`Robot "${robotData.name}" created successfully`, 'success');
    }

    closeModal();
    loadRobots();
    loadStatistics();
  } catch (error) {
    console.error('Form submission error:', error);
  }
}

function updateBatteryIndicator() {
  const value = elements.robotBattery.value;
  elements.batteryFill.style.width = `${value}%`;

  if (value < 20) {
    elements.batteryFill.className = 'battery-fill low';
  } else if (value < 50) {
    elements.batteryFill.className = 'battery-fill medium';
  } else {
    elements.batteryFill.className = 'battery-fill';
  }
}

// ===================================
// Delete Handling
// ===================================
function confirmDelete(id, name) {
  if (confirm(`Are you sure you want to delete robot "${name}"?\n\nThis action cannot be undone.`)) {
    handleDelete(id, name);
  }
}

async function handleDelete(id, name) {
  try {
    await deleteRobot(id);
    showToast(`Robot "${name}" deleted successfully`, 'success');
    loadRobots();
    loadStatistics();
  } catch (error) {
    console.error('Delete error:', error);
  }
}

// ===================================
// Toast Notifications
// ===================================
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const icon = type === 'success' ? '✅' :
               type === 'error' ? '❌' :
               type === 'warning' ? '⚠️' : 'ℹ️';

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${escapeHtml(message)}</span>
  `;

  elements.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ===================================
// Utility Functions
// ===================================
function getRobotIcon(type) {
  const icons = {
    industrial: '🏭',
    logistics: '📦',
    inspection: '🔍',
    research: '🔬',
    medical: '🏥',
    agricultural: '🌾'
  };
  return icons[type] || '🤖';
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Make functions globally available for inline handlers
window.editRobot = editRobot;
window.viewRobotDetails = viewRobotDetails;
window.confirmDelete = confirmDelete;
