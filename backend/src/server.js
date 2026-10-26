import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import env from './config/env.js';
import { isRealFirebaseConnected } from './config/firebase.js';
import { isGeminiLive, getActiveModelName } from './config/gemini.js';
import { getActiveGeospatialProvider } from './services/geospatialProvider.js';

// Route imports
import reportsRoutes from './routes/reportsRoutes.js';
import zonesRoutes from './routes/zonesRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

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
    },
  });
});

// Mount Routes
app.use('/api/reports', reportsRoutes);
app.use('/api/zones', zonesRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);

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
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'An internal server error occurred.',
    ...(env.IS_PRODUCTION ? {} : { stack: err.stack }),
  });
});

// Start listening if not imported in tests
if (process.env.NODE_ENV !== 'test') {
  const PORT = env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`
================================================================
🌿 ARAVALLI SENTINEL — Backend API Active
📡 Running at: http://localhost:${PORT}
🗺️ Health: http://localhost:${PORT}/api/health
================================================================
    `);
  });
}

export default app;
