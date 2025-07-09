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
import { connectDB } from './services/db';
import collegeRoutes from './routes/collegeRoutes';
import hospitalRoutes from './routes/hospitalRoutes';
import { seedColleges } from './utils/seedColleges';
import { seedHospitals } from './utils/seedHospitals';

const app = express();
const PORT = process.env.PORT ;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3001',
  credentials: true,
}));


connectDB()
  .then(async () => {
    console.log(" MongoDB connected");

    // Seed data
    await seedHospitals();

    // Mount routes
    app.use('/api/auth', authRoutes);
    app.use('/api/institutions', institutionsRoutes);
    app.use('/api/lookup', lookupRoutes);
    app.use('/api/user', userRoutes);
    app.use("/api/colleges", collegeRoutes);
    app.use("/api/hospitals", hospitalRoutes);
    app.use("/api/connections", connectionRoutes);

    app.listen(PORT, () => {
      console.log(` Express server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1); // exit if DB can't be connected
  });
