import { NextFunction, Request, Response } from "express";
import { validateToken } from "../utils/utitlity/jwt";


interface JwtPayload {
    id: string; 
  }
export interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
  res.status(403).json({ message: 'Authorization header is missing' });
  return 
  }
  const token = authHeader.split(' ')[1]; 
  try {
    const decoded = validateToken(token,);
    req.user = decoded.id; 

    next();
  } catch (error) {
   res.status(401).json({ message: 'Invalid or expired token' });
   return
  }
};
