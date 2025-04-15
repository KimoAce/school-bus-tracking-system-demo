// src/test-api.js
const axios = require('axios');

// Base URL for API requests (change this to your deployed API URL)
const BASE_URL = process.env.API_URL || 'http://localhost:5000';

// Store authentication token
let authToken = '';

// Helper function to make API requests
async function makeRequest(method, endpoint, data = null, token = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data && (method === 'post' || method === 'put')) {
      config.data = data;
    }

    const response = await axios(config);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data : error.message,
      status: error.response ? error.response.status : null,
    };
  }
}

// Test health endpoint
async function testHealth() {
  console.log('\n--- Testing Health Endpoint ---');
  const result = await makeRequest('get', '/api/health');
  console.log(result);
  return result.success;
}

// Test authentication
async function testAuth() {
  console.log('\n--- Testing Authentication ---');
  
  // Test login with demo driver credentials
  // Change these credentials to match your demo data
  const loginData = {
    phone: '93934444',
    password: 'password123'
  };
  
  const loginResult = await makeRequest('post', '/api/auth/login', loginData);
  console.log('Login result:', loginResult.success ? 'SUCCESS' : 'FAILED');
  
  if (loginResult.success && loginResult.data.token) {
    authToken = loginResult.data.token;
    console.log('Successfully authenticated, token received');
    return true;
  } else {
    console.log('Authentication failed:', loginResult.error);
    return false;
  }
}

// Test bus endpoints
async function testBuses() {
  console.log('\n--- Testing Bus Endpoints ---');
  
  // Get all buses
  const busesResult = await makeRequest('get', '/api/buses', null, authToken);
  console.log('Get buses result:', busesResult.success ? 'SUCCESS' : 'FAILED');
  console.log('Number of buses:', busesResult.success ? busesResult.data.length : 0);
  
  return busesResult.success;
}

// Test route endpoints
async function testRoutes() {
  console.log('\n--- Testing Route Endpoints ---');
  
  // Get all routes
  const routesResult = await makeRequest('get', '/api/routes', null, authToken);
  console.log('Get routes result:', routesResult.success ? 'SUCCESS' : 'FAILED');
  console.log('Number of routes:', routesResult.success ? routesResult.data.length : 0);
  
  return routesResult.success;
}

// Test trip endpoints
async function testTrips() {
  console.log('\n--- Testing Trip Endpoints ---');
  
  // Get all trips
  const tripsResult = await makeRequest('get', '/api/trips', null, authToken);
  console.log('Get trips result:', tripsResult.success ? 'SUCCESS' : 'FAILED');
  console.log('Number of trips:', tripsResult.success ? tripsResult.data.length : 0);
  
  return tripsResult.success;
}

// Run all tests
async function runTests() {
  console.log('=== Starting API Tests ===');
  
  // Test health
  const healthOk = await testHealth();
  if (!healthOk) {
    console.error('Health check failed. Make sure the server is running.');
    return;
  }
  
  // Test authentication
  const authOk = await testAuth();
  if (!authOk) {
    console.error('Authentication failed. Cannot proceed with other tests.');
    return;
  }
  
  // Run other tests
  await testBuses();
  await testRoutes();
  await testTrips();
  
  console.log('\n=== Tests Completed ===');
}

// Run tests
runTests().catch(err => {
  console.error('Error during tests:', err);
});