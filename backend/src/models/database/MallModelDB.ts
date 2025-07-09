import { query } from '../../config/database';
import { Mall } from '../../types/index';

export class MallModelDB {
  static async findAll(): Promise<Mall[]> {
    try {
      const result = await query(
        'SELECT * FROM malls WHERE is_active = true ORDER BY name'
      );
      return result.rows.map(this.mapRowToMall);
    } catch (error) {
      console.error('Error fetching malls:', error);
      throw error;
    }
  }

  static async findById(id: string): Promise<Mall | null> {
    try {
      const result = await query(
        'SELECT * FROM malls WHERE id = $1 AND is_active = true',
        [id]
      );
      return result.rows.length > 0 ? this.mapRowToMall(result.rows[0]) : null;
    } catch (error) {
      console.error('Error fetching mall by ID:', error);
      throw error;
    }
  }

  static async findByCity(city: string): Promise<Mall[]> {
    try {
      const result = await query(
        'SELECT * FROM malls WHERE city = $1 AND is_active = true ORDER BY name',
        [city]
      );
      return result.rows.map(this.mapRowToMall);
    } catch (error) {
      console.error('Error fetching malls by city:', error);
      throw error;
    }
  }

  static async search(searchQuery: string): Promise<Mall[]> {
    try {
      const searchTerm = `%${searchQuery}%`;
      const result = await query(
        `SELECT * FROM malls 
         WHERE (name ILIKE $1 OR description ILIKE $1 OR city ILIKE $1) 
         AND is_active = true 
         ORDER BY name`,
        [searchTerm]
      );
      return result.rows.map(this.mapRowToMall);
    } catch (error) {
      console.error('Error searching malls:', error);
      throw error;
    }
  }

  static async create(mallData: Omit<Mall, 'id' | 'createdAt' | 'updatedAt'>): Promise<Mall> {
    try {
      const result = await query(
        `INSERT INTO malls (name, name_ar, description, address, city, country, 
         latitude, longitude, phone, email, website, hours, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         RETURNING *`,
        [
          mallData.name,
          mallData.nameAr,
          mallData.description,
          mallData.address,
          mallData.city,
          mallData.country,
          mallData.latitude,
          mallData.longitude,
          mallData.phone,
          mallData.email,
          mallData.website,
          JSON.stringify(mallData.hours),
          mallData.isActive ?? true
        ]
      );
      return this.mapRowToMall(result.rows[0]);
    } catch (error) {
      console.error('Error creating mall:', error);
      throw error;
    }
  }

  static async update(id: string, updates: Partial<Mall>): Promise<Mall | null> {
    try {
      const setClause = Object.keys(updates)
        .map((key, index) => `${key} = $${index + 2}`)
        .join(', ');
      
      const values = Object.values(updates);
      
      const result = await query(
        `UPDATE malls SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $1 RETURNING *`,
        [id, ...values]
      );
      
      return result.rows.length > 0 ? this.mapRowToMall(result.rows[0]) : null;
    } catch (error) {
      console.error('Error updating mall:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      await query('UPDATE malls SET is_active = false WHERE id = $1', [id]);
      return true;
    } catch (error) {
      console.error('Error deleting mall:', error);
      throw error;
    }
  }

  private static mapRowToMall(row: any): Mall {
    return {
      id: row.id,
      name: row.name,
      nameAr: row.name_ar,
      description: row.description,
      address: row.address,
      city: row.city,
      country: row.country,
      latitude: row.latitude,
      longitude: row.longitude,
      phone: row.phone,
      email: row.email,
      website: row.website,
      hours: typeof row.hours === 'string' ? JSON.parse(row.hours) : row.hours,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}