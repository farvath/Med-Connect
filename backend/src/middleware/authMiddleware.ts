import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET as string;

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies['accessToken'];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, jwtSecret) as { id: string };
    (req as any).userId = decoded.id;
    next();
  } catch (error) {
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
