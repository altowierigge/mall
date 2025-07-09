import { Response } from 'express';
import { ApiResponse } from '../types';

export class ApiResponseUtil {
  static success<T>(res: Response, data: T, message?: string): void {
    const response: ApiResponse<T> = {
      success: true,
      data,
      message,
    };
    res.status(200).json(response);
  }

  static created<T>(res: Response, data: T, message?: string): void {
    const response: ApiResponse<T> = {
      success: true,
      data,
      message,
    };
    res.status(201).json(response);
  }

  static error(res: Response, message: string, statusCode: number = 500): void {
    const response: ApiResponse<null> = {
      success: false,
      error: message,
    };
    res.status(statusCode).json(response);
  }

  static badRequest(res: Response, message: string): void {
    this.error(res, message, 400);
  }

  static unauthorized(res: Response, message: string = 'Unauthorized'): void {
    this.error(res, message, 401);
  }

  static forbidden(res: Response, message: string = 'Forbidden'): void {
    this.error(res, message, 403);
  }

  static notFound(res: Response, message: string = 'Not found'): void {
    this.error(res, message, 404);
  }

  static conflict(res: Response, message: string): void {
    this.error(res, message, 409);
  }

  static serverError(res: Response, message: string = 'Internal server error'): void {
    this.error(res, message, 500);
  }
}