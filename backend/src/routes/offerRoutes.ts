import { Router } from 'express';
import { OfferController } from '../controllers/offerController';

const router = Router();

// GET /api/v1/malls/:mallId/offers - Get all offers for a mall
router.get('/:mallId/offers', OfferController.getOffers);

// GET /api/v1/malls/:mallId/offers/:offerId - Get specific offer
router.get('/:mallId/offers/:offerId', OfferController.getOffer);

export default router;