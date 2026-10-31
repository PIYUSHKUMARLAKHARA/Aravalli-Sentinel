import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import env from './config/env.js';
import { isRealFirebaseConnected } from './config/firebase.js';
import { isGeminiLive, getActiveModelName } from './config/gemini.js';
import { connectDB, getDatabaseStatus } from './config/db.js';
import { getActiveGeospatialProvider } from './services/geospatialProvider.js';

// Route imports
import reportsRoutes from './routes/reportsRoutes.js';
import zonesRoutes from './routes/zonesRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import notificationsRoutes from './routes/notificationsRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import satelliteRoutes from './routes/satelliteRoutes.js';
import rewardsRoutes from './routes/rewardsRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Ensure uploads and evidence directories exist on disk
const uploadsDir = path.resolve(__dirname, '../uploads');
const evidenceDir = path.resolve(uploadsDir, 'evidence');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(evidenceDir)) {
  fs.mkdirSync(evidenceDir, { recursive: true });
}

// Locate datasets/citizen_reports/images directory
const datasetImagesDir = path.resolve(__dirname, '../../datasets/citizen_reports/images');
const altDatasetImagesDir = path.resolve(__dirname, '../datasets/citizen_reports/images');
const resolvedDatasetImages = fs.existsSync(datasetImagesDir) ? datasetImagesDir : altDatasetImagesDir;

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS Configuration
app.use(cors({
  origin: env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Request Logger
app.use(morgan(env.IS_PRODUCTION ? 'combined' : 'dev'));

// Static Evidence and Dataset Image Serving (serves both root and /api prefixed routes)
app.use('/uploads', express.static(uploadsDir));
app.use('/api/uploads', express.static(uploadsDir));
if (fs.existsSync(resolvedDatasetImages)) {
  app.use('/datasets/images', express.static(resolvedDatasetImages));
  app.use('/api/datasets/images', express.static(resolvedDatasetImages));
  app.use('/images', express.static(resolvedDatasetImages));
}

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests from this IP address. Please try again after 15 minutes.',
  },
});
app.use('/api', apiLimiter);

// Parsers
app.use(express.json({ limit: '12mb' }));
app.use(express.urlencoded({ extended: true, limit: '12mb' }));

// Health & System Status Endpoint
app.get('/api/health', (req, res) => {
  const geoProvider = getActiveGeospatialProvider();

  res.json({
    status: 'ONLINE',
    platform: 'ARAVALLI SENTINEL',
    version: '1.0.0',
    tagline: 'See the Threat. Predict the Risk. Protect the Aravallis.',
    timestamp: new Date().toISOString(),
    services: {
      database: getDatabaseStatus(),
      firebase: {
        connected: isRealFirebaseConnected(),
        mode: isRealFirebaseConnected() ? 'Live Firebase Firestore & Storage' : 'Local Fallback / High-Fidelity Store',
      },
      geminiAI: {
        active: isGeminiLive(),
        model: getActiveModelName(),
        mode: isGeminiLive() ? 'Live Gemini 2.0 Flash Engine' : 'Heuristic Guided Ecological Assessment (Demo Fallback)',
      },
      geospatialTelemetry: {
        provider: geoProvider.getProviderName(),
        live: geoProvider.isLiveProvider(),
      },
      storage: {
        uploadsDir: '/uploads/evidence',
        datasetImagesDir: '/datasets/images',
      },
    },
  });
});

// Mount Routes
app.use('/api/reports', reportsRoutes);
app.use('/api/zones', zonesRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/satellite', satelliteRoutes);
app.use('/api/rewards', rewardsRoutes);

// Root informational endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'ARAVALLI SENTINEL REST API',
    description: 'AI-Powered Ecological Early-Warning & Action Platform for the Aravalli Ecosystem',
    healthCheck: '/api/health',
    documentation: '/docs',
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err);
  let statusCode = err.status || 500;
  if (err.name === 'MulterError' || err.code === 'LIMIT_FILE_SIZE' || err.message?.includes('Unsupported file type')) {
    statusCode = 400;
  }
  res.status(statusCode).json({
    success: false,
    error: err.message || 'An internal server error occurred.',
    ...(env.IS_PRODUCTION ? {} : { stack: err.stack }),
  });
});

// Start listening if not imported in tests
if (process.env.NODE_ENV !== 'test') {
  const PORT = env.PORT || 5000;
  connectDB().then(() => {
    const dbStatus = getDatabaseStatus();
    app.listen(PORT, () => {
      console.log(`
================================================================
🌿 ARAVALLI SENTINEL — Backend API Active
📡 Running at: http://localhost:${PORT}
🗺️ Health: http://localhost:${PORT}/api/health
🗄️ Database: ${dbStatus.type} (${dbStatus.status})
================================================================
      `);
    });
  });
}

export default app;
