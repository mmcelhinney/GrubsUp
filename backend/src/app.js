import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase } from './utils/initDb.js';
import { requestLogger } from './middleware/logger.js';
import authRoutes from './routes/auth.js';
import uploadRoutes from './routes/upload.js';
import aiRoutes from './routes/ai.js';
import recipeRoutes from './routes/recipes.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0'; // Listen on all network interfaces

// Trust proxy to get real IP addresses
app.set('trust proxy', true);

// Middleware - Allow CORS from any origin in development
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true
}));

// Request logging middleware (before other middleware)
app.use(requestLogger);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Initialize database on startup (don't block server start)
initDatabase().catch((error) => {
  console.error('⚠️  Database initialization failed, but server will continue:', error.message);
  console.error('   You can still use the API, but database features may not work');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    const prisma = (await import('./utils/db.js')).default;
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({ 
      status: 'ok', 
      message: 'DinnersReady API is running',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'DinnersReady API is running but database connection failed',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  console.error(`\n❌ ERROR [${new Date().toISOString()}]`);
  console.error(`  IP: ${clientIP}`);
  console.error(`  Path: ${req.path}`);
  console.error(`  Method: ${req.method}`);
  console.error(`  Error:`, err.message);
  console.error(`  Stack:`, err.stack);
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Get local IP address for network access
import os from 'os';

function getLocalIP() {
  try {
    const interfaces = os.networkInterfaces();
    
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        // Skip internal (loopback) and non-IPv4 addresses
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
        }
      }
    }
  } catch (error) {
    // Ignore errors
  }
  return 'localhost';
}

// Start server
const localIP = getLocalIP();

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌐 Network access: http://${localIP}:${PORT}`);
  console.log(`\n📱 To access from your phone:`);
  console.log(`   1. Make sure your phone is on the same WiFi network`);
  console.log(`   2. Frontend: http://${localIP}:3000`);
  console.log(`   3. Backend API: http://${localIP}:${PORT}/api/health`);
});

export default app;

