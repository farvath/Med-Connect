import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import institutionsRoutes from './routes/institutionsRoutes';
import lookupRoutes from './routes/lookupRoutes';
import userRoutes from './routes/userRoutes';
import connectionRoutes from './routes/connectionRoutes';
import postRoutes from './routes/postRoutes';
import jobRoutes from './routes/jobRoutes';
import { connectDB } from './services/db';
import collegeRoutes from './routes/collegeRoutes';
import hospitalRoutes from './routes/hospitalRoutes';


const app = express();
const PORT = process.env.PORT ;

app.use(express.json());
app.use(cookieParser());
// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

// Add default origins based on environment
const defaultOrigins = [
  'http://localhost:3001',
  'http://localhost:3000',
];

// Add production origins
if (process.env.NODE_ENV === 'production') {
  defaultOrigins.push('https://medconnect-mvp.netlify.app');
}

const corsOrigins = allowedOrigins.length > 0 ? allowedOrigins : defaultOrigins;


app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));


// Setup routes and middleware
async function setupApp() {
  try {
    await connectDB();
    console.log("MongoDB connected");

    // Mount routes
    app.use('/api/auth', authRoutes);
    app.use('/api/institutions', institutionsRoutes);
    app.use('/api/lookup', lookupRoutes);
    app.use('/api/user', userRoutes);
    app.use("/api/colleges", collegeRoutes);
    app.use("/api/hospitals", hospitalRoutes);
    app.use("/api/connections", connectionRoutes);
    app.use("/api/posts", postRoutes);
    app.use("/api/jobs", jobRoutes);

    app.use("/", (req, res) => {
      res.status(200).json({ message: "Backend is connected successfully, you're hitting / route correctly." });
    });

    return app;
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    throw err;
  }
}

// For local development
if (process.env.NODE_ENV !== 'production') {
  setupApp().then(() => {
    app.listen(PORT, () => {
      console.log(`Express server running on http://localhost:${PORT}`);
    });
  }).catch((err) => {
    console.error("Failed to start server", err);
    process.exit(1);
  });
}

// Export for Vercel
export default async function handler(req: any, res: any) {
  await setupApp();
  return app(req, res);
}
