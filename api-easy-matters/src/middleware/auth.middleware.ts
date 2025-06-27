import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

/**
 * Middleware to authenticate requests using JWT token
 * Attaches the authenticated user to the request object if successful
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const user = authService.validateToken(authHeader);
    (req as any).user = user; // Attach user to the request object
    next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Token has expired') {
        res.status(401).json({ error: 'Token has expired' });
        return;
      }
      if (error.message === 'Invalid token') {
        res.status(401).json({ error: 'Invalid token' });
        return;
      }
    }
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Failed to authenticate' });
  }
};
