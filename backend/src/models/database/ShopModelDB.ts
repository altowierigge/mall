import { query } from '../../config/database';
import { Shop } from '../../types/index';

export class ShopModelDB {
  static async findAll(): Promise<Shop[]> {
    try {
      const result = await query(
        `SELECT s.*, m.name as mall_name 
         FROM shops s 
         JOIN malls m ON s.mall_id = m.id 
         WHERE s.is_active = true 
         ORDER BY s.name`
      );
      
      return result.rows.map(this.mapRowToShop);
    } catch (error) {
      console.error('Error fetching shops:', error);
      throw error;
    }
  }

  static async findById(id: string): Promise<Shop | null> {
    try {
      const result = await query(
        `SELECT s.*, m.name as mall_name 
         FROM shops s 
         JOIN malls m ON s.mall_id = m.id 
         WHERE s.id = $1 AND s.is_active = true`,
        [id]
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return this.mapRowToShop(result.rows[0]);
    } catch (error) {
      console.error('Error fetching shop by ID:', error);
      throw error;
    }
  }

  static async findByMallId(mallId: string): Promise<Shop[]> {
    try {
      const result = await query(
        `SELECT s.*, m.name as mall_name 
         FROM shops s 
         JOIN malls m ON s.mall_id = m.id 
         WHERE s.mall_id = $1 AND s.is_active = true 
         ORDER BY s.name`,
        [mallId]
      );
      
      return result.rows.map(this.mapRowToShop);
    } catch (error) {
      console.error('Error fetching shops by mall ID:', error);
      throw error;
    }
  }

  static async findByCategory(category: string): Promise<Shop[]> {
    try {
      const result = await query(
        `SELECT s.*, m.name as mall_name 
         FROM shops s 
         JOIN malls m ON s.mall_id = m.id 
         WHERE s.category = $1 AND s.is_active = true 
         ORDER BY s.name`,
        [category]
      );
      
      return result.rows.map(this.mapRowToShop);
    } catch (error) {
      console.error('Error fetching shops by category:', error);
      throw error;
    }
  }

  static async search(mallId: string, searchTerm: string): Promise<Shop[]> {
    try {
      const result = await query(
        `SELECT s.*, m.name as mall_name 
         FROM shops s 
         JOIN malls m ON s.mall_id = m.id 
         WHERE s.mall_id = $1 
         AND (s.name ILIKE $2 OR s.name_ar ILIKE $2 OR s.description ILIKE $2) 
         AND s.is_active = true 
         ORDER BY s.name`,
        [mallId, `%${searchTerm}%`]
      );
      
      return result.rows.map(this.mapRowToShop);
    } catch (error) {
      console.error('Error searching shops:', error);
      throw error;
    }
  }

  static async getFeaturedShops(mallId: string): Promise<Shop[]> {
    try {
      const result = await query(
        `SELECT s.*, m.name as mall_name 
         FROM shops s 
         JOIN malls m ON s.mall_id = m.id 
         WHERE s.mall_id = $1 AND s.is_active = true AND s.is_featured = true 
         ORDER BY s.name`,
        [mallId]
      );
      
      return result.rows.map(this.mapRowToShop);
    } catch (error) {
      console.error('Error fetching featured shops:', error);
      throw error;
    }
  }

  static async getCategories(mallId: string): Promise<string[]> {
    try {
      const result = await query(
        'SELECT DISTINCT category FROM shops WHERE mall_id = $1 AND is_active = true ORDER BY category',
        [mallId]
      );
      
      return result.rows.map((row: any) => row.category);
    } catch (error) {
      console.error('Error fetching shop categories:', error);
      throw error;
    }
  }

  static async update(id: string, updateData: Partial<Shop>): Promise<Shop | null> {
    try {
      const setClause = [];
      const values = [];
      let paramIndex = 1;

      // Build dynamic SET clause
      for (const [key, value] of Object.entries(updateData)) {
        if (value === undefined) continue;

        // Handle nested fields
        if (key === 'location' && typeof value === 'object') {
          const { floor, zone, unit } = value as any;
          if (floor !== undefined) {
            setClause.push(`floor = $${paramIndex++}`);
            values.push(floor);
          }
          if (zone !== undefined) {
            setClause.push(`zone = $${paramIndex++}`);
            values.push(zone);
          }
          if (unit !== undefined) {
            setClause.push(`unit = $${paramIndex++}`);
            values.push(unit);
          }
          continue;
        }

        if (key === 'contact' && typeof value === 'object') {
          const { phone, whatsapp, email } = value as any;
          if (phone !== undefined) {
            setClause.push(`phone = $${paramIndex++}`);
            values.push(phone);
          }
          if (whatsapp !== undefined) {
            setClause.push(`whatsapp = $${paramIndex++}`);
            values.push(whatsapp);
          }
          if (email !== undefined) {
            setClause.push(`email = $${paramIndex++}`);
            values.push(email);
          }
          continue;
        }

        if (key === 'subscription' && typeof value === 'object') {
          const { tier, status } = value as any;
          if (tier !== undefined) {
            setClause.push(`subscription_tier = $${paramIndex++}`);
            values.push(tier);
          }
          if (status !== undefined) {
            setClause.push(`subscription_status = $${paramIndex++}`);
            values.push(status);
          }
          continue;
        }

        const dbColumn = this.mapFieldToColumn(key);
        if (dbColumn) {
          setClause.push(`${dbColumn} = $${paramIndex++}`);
          values.push(typeof value === 'object' ? JSON.stringify(value) : value);
        }
      }

      if (setClause.length === 0) {
        return this.findById(id);
      }

      values.push(id);

      const result = await query(
        `UPDATE shops 
         SET ${setClause.join(', ')} 
         WHERE id = $${paramIndex} AND is_active = true 
         RETURNING *`,
        values
      );

      if (result.rows.length === 0) {
        return null;
      }

      return this.mapRowToShop(result.rows[0]);
    } catch (error) {
      console.error('Error updating shop:', error);
      throw error;
    }
  }

  static async create(shopData: Omit<Shop, 'id' | 'createdAt' | 'updatedAt'>): Promise<Shop> {
    try {
      const result = await query(
        `INSERT INTO shops (
          mall_id, name, name_ar, category, description, description_ar,
          icon_url, website_url, floor, zone, unit, phone, whatsapp, email,
          hours, subscription_tier, subscription_status, features, rating, is_active
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
        ) RETURNING *`,
        [
          shopData.mallId,
          shopData.name,
          shopData.nameAr,
          shopData.category,
          shopData.description || null,
          shopData.descriptionAr || null,
          shopData.iconUrl || null,
          shopData.websiteUrl || null,
          shopData.location?.floor || null,
          shopData.location?.zone || null,
          shopData.location?.unit || null,
          shopData.contact?.phone || null,
          shopData.contact?.whatsapp || null,
          shopData.contact?.email || null,
          JSON.stringify(shopData.hours),
          shopData.subscription?.tier || 'basic',
          shopData.subscription?.status || 'active',
          JSON.stringify(shopData.features || {}),
          shopData.rating || 0,
          shopData.isActive !== undefined ? shopData.isActive : true
        ]
      );

      return this.mapRowToShop(result.rows[0]);
    } catch (error) {
      console.error('Error creating shop:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      const result = await query(
        'UPDATE shops SET is_active = false WHERE id = $1 RETURNING id',
        [id]
      );

      return result.rows.length > 0;
    } catch (error) {
      console.error('Error deleting shop:', error);
      throw error;
    }
  }

  private static mapRowToShop(row: any): Shop {
    return {
      id: row.id,
      mallId: row.mall_id,
      name: row.name,
      nameAr: row.name_ar,
      category: row.category,
      iconUrl: row.icon_url || '/images/default-shop-icon.png',
      websiteUrl: row.website_url || '',
      description: row.description || '',
      descriptionAr: row.description_ar || '',
      location: {
        floor: row.floor || '',
        zone: row.zone || '',
        unit: row.unit || ''
      },
      contact: {
        phone: row.phone || '',
        whatsapp: row.whatsapp || '',
        email: row.email || ''
      },
      hours: typeof row.hours === 'string' ? JSON.parse(row.hours) : row.hours,
      rating: parseFloat(row.rating) || 0,
      isActive: row.is_active,
      subscription: {
        tier: row.subscription_tier || 'basic',
        status: row.subscription_status || 'active'
      },
      features: typeof row.features === 'string' ? JSON.parse(row.features) : row.features || {},
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private static mapFieldToColumn(field: string): string | null {
    const fieldMap: { [key: string]: string } = {
      name: 'name',
      nameAr: 'name_ar',
      category: 'category',
      description: 'description',
      descriptionAr: 'description_ar',
      iconUrl: 'icon_url',
      websiteUrl: 'website_url',
      hours: 'hours',
      rating: 'rating',
      isActive: 'is_active',
      isFeatured: 'is_featured',
      features: 'features'
    };

    return fieldMap[field] || null;
  }
}