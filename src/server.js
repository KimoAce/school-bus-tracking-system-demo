// backend/src/server.js

require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const mysql = require('mysql2/promise');
const { syncDatabase } = require('./models');
const seedDemoData = require('./seeders/demo.seeder');

// Define allowed origins
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? (process.env.SOCKET_CORS_ORIGIN ? process.env.SOCKET_CORS_ORIGIN.split(',') : [
      // Default production origins if SOCKET_CORS_ORIGIN isn't set
      'https://kimoace.github.io',
      'https://kimoace.github.io/school-bus-tracking-system-demo'
    ]) 
  : [
      'http://localhost:3000', 
      'http://localhost:5173', 
      'http://localhost:5174', 
      'exp://localhost:19000'
    ];

// Database setup function
async function setupDatabase() {
  try {
    console.log('Connecting to database...');
    
    // In production, just test the connection without trying to create the database
    if (process.env.NODE_ENV === 'production') {
      try {
        // First check if we have a DATABASE_URL from Railway
        if (process.env.DATABASE_URL) {
          console.log('Testing DATABASE_URL connection...');
          // We'll use the sequelize instance for this test
          const sequelize = require('./config/database');
          await sequelize.authenticate();
          console.log('Database connection via DATABASE_URL successful');
          return true;
        } else {
          // Fallback to individual connection parameters
          const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
          });
          
          await connection.ping();
          console.log('Database connection via individual parameters successful');
          await connection.end();
          return true;
        }
      } catch (error) {
        console.error('Warning: Database connection failed, but server will still start:', error);
        return true; // Return true anyway to allow server to start
      }
    }
    
    // In development, try to create the database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });
    
    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'school_bus_tracking_system_demo';
    console.log(`Creating database ${dbName} if it doesn't exist...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    
    console.log(`Database ${dbName} created or already exists`);
    
    await connection.end();
    console.log('Database setup completed successfully');
    return true;
  } catch (error) {
    console.error('Database setup warning:', error);
    // Return true anyway to allow server to start in production
    return process.env.NODE_ENV === 'production';
  }
}

const app = express();
const server = http.createServer(app);

// Configure Socket.IO with CORS
const io = socketIO(server, {
  cors: {
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, etc)
      if (!origin) return callback(null, true);
      
      // Check if the origin is allowed
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Configure CORS for Express
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    // Check if the origin is allowed
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Other middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for demo purposes
  crossOriginEmbedderPolicy: false // Allow embedding
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Import routes
const authRoutes = require('./routes/auth.routes');
const busRoutes = require('./routes/bus.routes');
const routeRoutes = require('./routes/route.routes');
const stopRoutes = require('./routes/stop.routes');
const tripRoutes = require('./routes/trip.routes');
const alertRoutes = require('./routes/alert.routes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/stops', stopRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/alerts', alertRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('School Bus Tracking System API');
});

// Socket.IO configuration
const socketModule = require('./socket');
const { locationNamespace, alertsNamespace, notificationsNamespace } = socketModule.initializeSocket(io);

// Socket authentication middleware
locationNamespace.use((socket, next) => {
  // For demo purposes, we'll skip complex authentication
  next();
});

// Socket event handlers
locationNamespace.on('connection', (socket) => {
  console.log('Client connected to location namespace');
  
  socket.on('location:update', (data) => {
    // Broadcast location to all clients
    locationNamespace.emit('location:broadcast', data);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected from location namespace');
  });
});

alertsNamespace.on('connection', (socket) => {
  console.log('Client connected to alerts namespace');
  
  socket.on('alert:new', (data) => {
    // Broadcast alert to all clients
    alertsNamespace.emit('alert:broadcast', data);
  });
});

notificationsNamespace.on('connection', (socket) => {
  console.log('Client connected to notifications namespace');
  
  socket.on('notification:new', (data) => {
    // Broadcast notification to specific user
    if (data.userId) {
      socket.to(data.userId).emit('notification:broadcast', data);
    }
  });
});

// Sync database and start server
const PORT = process.env.PORT || 5000;

// First run setup, then sync database, then start server
setupDatabase()
  .then(success => {
    if (!success && process.env.NODE_ENV !== 'production') {
      console.error('Database setup failed, server will not start in development mode');
      process.exit(1);
    }
    
    // Try to sync database, but continue even if it fails in production
    return syncDatabase().catch(err => {
      if (process.env.NODE_ENV === 'production') {
        console.error('Database sync failed, but continuing anyway in production:', err);
        return Promise.resolve();
      }
      throw err;
    });
  })
  .then(() => {
    // Only seed data in development environment
    if (process.env.NODE_ENV !== 'production') {
      console.log('Seeding demo data...');
      return seedDemoData();
    } else {
      console.log('Skipping demo data seeding in production mode');
      return Promise.resolve();
    }
  })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to start server:', err);
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    } else {
      // In production, try to start the server anyway
      server.listen(PORT, () => {
        console.log(`Server running on port ${PORT} (after error recovery)`);
      });
    }
  });