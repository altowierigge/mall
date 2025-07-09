import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ShopOwnerModel } from '../models/ShopOwnerModel';
import { ShopOwner } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

export interface AuthRequest extends Request {
  user?: ShopOwner;
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access token required',
      });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; shopId: string };
    const user = await ShopOwnerModel.findById(decoded.userId);

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Authentication error',
      });
    }
  }
};

export const requireShopOwner = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== 'shop_owner') {
    res.status(403).json({
      success: false,
      message: 'Shop owner access required',
    });
    return;
  }
  next();
};

export const requireOwnShop = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const shopId = req.params.shopId || req.body.shopId;
  
  if (!req.user || req.user.shopId !== shopId) {
    res.status(403).json({
      success: false,
      message: 'Access denied: can only manage your own shop',
    });
    return;
  }
  next();
};

export const generateTokens = (user: ShopOwner) => {
  const accessToken = jwt.sign(
    { 
      userId: user.id, 
      shopId: user.shopId,
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { 
      userId: user.id, 
      shopId: user.shopId,
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};