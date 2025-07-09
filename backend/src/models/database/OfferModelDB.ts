import { query } from '../../config/database';
import { Offer } from '../../types/index';

export class OfferModelDB {
  static async findAll(): Promise<Offer[]> {
    try {
      const result = await query(
        'SELECT * FROM offers WHERE is_active = true ORDER BY created_at DESC'
      );
      return result.rows.map(this.mapRowToOffer);
    } catch (error) {
      console.error('Error fetching offers:', error);
      throw error;
    }
  }

  static async findById(id: string): Promise<Offer | null> {
    try {
      const result = await query(
        'SELECT * FROM offers WHERE id = $1 AND is_active = true',
        [id]
      );
      return result.rows.length > 0 ? this.mapRowToOffer(result.rows[0]) : null;
    } catch (error) {
      console.error('Error fetching offer by ID:', error);
      throw error;
    }
  }

  static async findByMallId(mallId: string): Promise<Offer[]> {
    try {
      const result = await query(
        `SELECT * FROM offers 
         WHERE mall_id = $1 AND is_active = true 
         AND valid_until > NOW() 
         ORDER BY is_featured DESC, created_at DESC`,
        [mallId]
      );
      return result.rows.map(this.mapRowToOffer);
    } catch (error) {
      console.error('Error fetching offers by mall ID:', error);
      throw error;
    }
  }

  static async findByShopId(shopId: string): Promise<Offer[]> {
    try {
      const result = await query(
        `SELECT * FROM offers 
         WHERE shop_id = $1 AND is_active = true 
         AND valid_until > NOW() 
         ORDER BY is_featured DESC, created_at DESC`,
        [shopId]
      );
      return result.rows.map(this.mapRowToOffer);
    } catch (error) {
      console.error('Error fetching offers by shop ID:', error);
      throw error;
    }
  }

  static async findFeaturedOffers(mallId: string): Promise<Offer[]> {
    try {
      const result = await query(
        `SELECT * FROM offers 
         WHERE mall_id = $1 AND is_active = true AND is_featured = true 
         AND valid_until > NOW() 
         ORDER BY created_at DESC`,
        [mallId]
      );
      return result.rows.map(this.mapRowToOffer);
    } catch (error) {
      console.error('Error fetching featured offers:', error);
      throw error;
    }
  }

  static async create(offerData: Omit<Offer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Offer> {
    try {
      const result = await query(
        `INSERT INTO offers (mall_id, shop_id, title, description, image_url, 
         valid_from, valid_until, discount_percentage, is_featured, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [
          offerData.mallId,
          offerData.shopId,
          offerData.title,
          offerData.description,
          offerData.imageUrl,
          offerData.validFrom,
          offerData.validUntil,
          offerData.discountPercentage,
          offerData.isFeatured,
          offerData.isActive ?? true
        ]
      );
      return this.mapRowToOffer(result.rows[0]);
    } catch (error) {
      console.error('Error creating offer:', error);
      throw error;
    }
  }

  static async update(id: string, updates: Partial<Offer>): Promise<Offer | null> {
    try {
      const setClause = Object.keys(updates)
        .map((key, index) => `${key} = $${index + 2}`)
        .join(', ');
      
      const values = Object.values(updates);
      
      const result = await query(
        `UPDATE offers SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $1 RETURNING *`,
        [id, ...values]
      );
      
      return result.rows.length > 0 ? this.mapRowToOffer(result.rows[0]) : null;
    } catch (error) {
      console.error('Error updating offer:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      await query('UPDATE offers SET is_active = false WHERE id = $1', [id]);
      return true;
    } catch (error) {
      console.error('Error deleting offer:', error);
      throw error;
    }
  }

  private static mapRowToOffer(row: any): Offer {
    return {
      id: row.id,
      mallId: row.mall_id,
      shopId: row.shop_id,
      title: row.title,
      description: row.description,
      imageUrl: row.image_url,
      validFrom: row.valid_from,
      validUntil: row.valid_until,
      discountPercentage: row.discount_percentage,
      isFeatured: row.is_featured,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}