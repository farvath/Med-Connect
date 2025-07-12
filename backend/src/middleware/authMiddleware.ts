import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET as string;

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies['accessToken'];
  
  // Enhanced debugging for production
  console.log('Auth Middleware Debug:');
  console.log('- Cookies available:', Object.keys(req.cookies || {}));
  console.log('- AccessToken present:', !!token);
  console.log('- JWT_SECRET present:', !!jwtSecret);
  console.log('- NODE_ENV:', process.env.NODE_ENV);
  
  if (!token) {
    console.log('No access token found in cookies');
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  if (!jwtSecret) {
    console.error('JWT_SECRET is not defined');
    return res.status(500).json({ message: 'Server configuration error' });
  }
  
  try {
    const decoded = jwt.verify(token, jwtSecret) as { id: string };
    console.log('Token decoded successfully for user:', decoded.id);
    (req as any).userId = decoded.id;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies['accessToken'];
  if (!token) {
    // No token, continue without setting userId
    return next();
  }
  try {
    const decoded = jwt.verify(token, jwtSecret) as { id: string };
    (req as any).userId = decoded.id;
    next();
  } catch (error) {
    // Invalid token, continue without setting userId
    next();
  }
}
