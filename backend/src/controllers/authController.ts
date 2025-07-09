import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ShopOwnerModelDB } from '../models/database/ShopOwnerModelDB';
import { generateTokens, AuthRequest } from '../middleware/authMiddleware';
import { ApiResponse } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    shopId: string;
    role: string;
    isActive: boolean;
    lastLogin?: Date;
  };
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: LoginRequest = req.body;

      // Validate input
      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'Email and password are required',
        });
        return;
      }

      // Find user by email
      const user = await ShopOwnerModelDB.findByEmail(email);
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
        return;
      }

      // Check if user is active
      if (!user.isActive) {
        res.status(401).json({
          success: false,
          message: 'Account is deactivated',
        });
        return;
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
        return;
      }

      // Update last login
      await ShopOwnerModelDB.updateLastLogin(user.id);

      // Generate tokens
      const { accessToken, refreshToken } = generateTokens(user);

      // Return response (exclude password)
      const userResponse = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        shopId: user.shopId,
        role: user.role,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
      };

      const response: ApiResponse<LoginResponse> = {
        success: true,
        data: {
          user: userResponse,
          token: accessToken,
          refreshToken,
          expiresIn: 15 * 60, // 15 minutes in seconds
        },
        message: 'Login successful',
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  static async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          message: 'Refresh token is required',
        });
        return;
      }

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, JWT_SECRET) as { userId: string; shopId: string };
      const user = await ShopOwnerModelDB.findById(decoded.userId);

      if (!user || !user.isActive) {
        res.status(401).json({
          success: false,
          message: 'Invalid refresh token',
        });
        return;
      }

      // Generate new tokens
      const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

      res.status(200).json({
        success: true,
        data: {
          token: accessToken,
          refreshToken: newRefreshToken,
        },
        message: 'Token refreshed successfully',
      });
    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      });
    }
  }

  static async logout(_req: AuthRequest, res: Response): Promise<void> {
    try {
      // In a real application, you would blacklist the token
      // For this demo, we'll just return success
      res.status(200).json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  static async profile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      const userResponse = {
        id: req.user.id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        phone: req.user.phone,
        shopId: req.user.shopId,
        role: req.user.role,
        isActive: req.user.isActive,
        lastLogin: req.user.lastLogin,
      };

      res.status(200).json({
        success: true,
        data: userResponse,
        message: 'Profile retrieved successfully',
      });
    } catch (error) {
      console.error('Profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
}