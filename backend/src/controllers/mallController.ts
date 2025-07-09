import { Request, Response } from 'express';
import { ApiResponseUtil } from '../utils/response';
import { MallModelDB } from '../models/database/MallModelDB';

export class MallController {
  static async getMallInfo(req: Request, res: Response): Promise<void> {
    try {
      const { mallId } = req.params;
      
      const mall = await MallModelDB.findById(mallId);
      if (!mall) {
        ApiResponseUtil.notFound(res, 'Mall not found');
        return;
      }

      ApiResponseUtil.success(res, mall);
    } catch (error) {
      console.error('Error fetching mall info:', error);
      ApiResponseUtil.serverError(res, 'Failed to fetch mall information');
    }
  }

  static async getMallList(_req: Request, res: Response): Promise<void> {
    try {
      const malls = await MallModelDB.findAll();
      ApiResponseUtil.success(res, malls);
    } catch (error) {
      console.error('Error fetching mall list:', error);
      ApiResponseUtil.serverError(res, 'Failed to fetch mall list');
    }
  }
}