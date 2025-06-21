import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import institutionsRoutes from './routes/institutionsRoutes';
// import other route files as you migrate them

const app = express();
const PORT = process.env.PORT ;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3001',
  credentials: true,
}));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/institutions', institutionsRoutes);
// app.use('/api/jobs', jobsRoutes);
// app.use('/api/posts', postsRoutes);

app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});
