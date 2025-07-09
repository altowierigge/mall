import { Request, Response } from 'express';
import { ApiResponseUtil } from '../utils/response';
import { OfferModelDB } from '../models/database/OfferModelDB';

export class OfferController {
  static async getOffers(req: Request, res: Response): Promise<void> {
    try {
      const { mallId } = req.params;
      const { featured, shopId } = req.query;

      let offers;
      
      if (featured === 'true') {
        offers = await OfferModelDB.findFeaturedOffers(mallId);
      } else if (shopId && typeof shopId === 'string') {
        offers = await OfferModelDB.findByShopId(shopId);
      } else {
        offers = await OfferModelDB.findByMallId(mallId);
      }

      ApiResponseUtil.success(res, offers);
    } catch (error) {
      console.error('Error fetching offers:', error);
      ApiResponseUtil.serverError(res, 'Failed to fetch offers');
    }
  }

  static async getOffer(req: Request, res: Response): Promise<void> {
    try {
      const { mallId, offerId } = req.params;

      const offer = await OfferModelDB.findById(offerId);

      if (!offer || offer.mallId !== mallId) {
        ApiResponseUtil.notFound(res, 'Offer not found');
        return;
      }

      ApiResponseUtil.success(res, offer);
    } catch (error) {
      console.error('Error fetching offer:', error);
      ApiResponseUtil.serverError(res, 'Failed to fetch offer');
    }
  }
}