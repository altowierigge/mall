import { query } from '../../config/database';
import { ShopOwner } from '../../types/index';
import bcrypt from 'bcryptjs';

export class ShopOwnerModelDB {
  static async findByEmail(email: string): Promise<ShopOwner | null> {
    try {
      const result = await query(
        'SELECT * FROM shop_owners WHERE email = $1 AND is_active = true',
        [email]
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return this.mapRowToShopOwner(result.rows[0]);
    } catch (error) {
      console.error('Error fetching shop owner by email:', error);
      throw error;
    }
  }

  static async findById(id: string): Promise<ShopOwner | null> {
    try {
      const result = await query(
        'SELECT * FROM shop_owners WHERE id = $1 AND is_active = true',
        [id]
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return this.mapRowToShopOwner(result.rows[0]);
    } catch (error) {
      console.error('Error fetching shop owner by ID:', error);
      throw error;
    }
  }

  static async findByShopId(shopId: string): Promise<ShopOwner | null> {
    try {
      const result = await query(
        'SELECT * FROM shop_owners WHERE shop_id = $1 AND is_active = true',
        [shopId]
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return this.mapRowToShopOwner(result.rows[0]);
    } catch (error) {
      console.error('Error fetching shop owner by shop ID:', error);
      throw error;
    }
  }

  static async create(shopOwnerData: Omit<ShopOwner, 'id' | 'createdAt' | 'updatedAt'>): Promise<ShopOwner> {
    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(shopOwnerData.password, 12);
      
      const result = await query(
        `INSERT INTO shop_owners (
          shop_id, email, password_hash, first_name, last_name, phone, role, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [
          shopOwnerData.shopId,
          shopOwnerData.email,
          hashedPassword,
          shopOwnerData.firstName,
          shopOwnerData.lastName,
          shopOwnerData.phone || null,
          shopOwnerData.role || 'shop_owner',
          shopOwnerData.isActive !== undefined ? shopOwnerData.isActive : true
        ]
      );

      return this.mapRowToShopOwner(result.rows[0]);
    } catch (error) {
      console.error('Error creating shop owner:', error);
      throw error;
    }
  }

  static async update(id: string, updateData: Partial<ShopOwner>): Promise<ShopOwner | null> {
    try {
      const setClause = [];
      const values = [];
      let paramIndex = 1;

      // Build dynamic SET clause
      for (const [key, value] of Object.entries(updateData)) {
        if (value !== undefined) {
          const dbColumn = this.mapFieldToColumn(key);
          if (dbColumn) {
            if (key === 'password') {
              // Hash password if updating
              const hashedPassword = await bcrypt.hash(value.toString(), 12);
              setClause.push(`password_hash = $${paramIndex++}`);
              values.push(hashedPassword);
            } else {
              setClause.push(`${dbColumn} = $${paramIndex++}`);
              values.push(value);
            }
          }
        }
      }

      if (setClause.length === 0) {
        return this.findById(id);
      }

      values.push(id);

      const result = await query(
        `UPDATE shop_owners 
         SET ${setClause.join(', ')} 
         WHERE id = $${paramIndex} AND is_active = true 
         RETURNING *`,
        values
      );

      if (result.rows.length === 0) {
        return null;
      }

      return this.mapRowToShopOwner(result.rows[0]);
    } catch (error) {
      console.error('Error updating shop owner:', error);
      throw error;
    }
  }

  static async updateLastLogin(id: string): Promise<void> {
    try {
      await query(
        'UPDATE shop_owners SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
        [id]
      );
    } catch (error) {
      console.error('Error updating last login:', error);
      throw error;
    }
  }

  static async validatePassword(email: string, password: string): Promise<ShopOwner | null> {
    try {
      const result = await query(
        'SELECT * FROM shop_owners WHERE email = $1 AND is_active = true',
        [email]
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const shopOwner = result.rows[0];
      const isValidPassword = await bcrypt.compare(password, shopOwner.password_hash);
      
      if (!isValidPassword) {
        return null;
      }
      
      return this.mapRowToShopOwner(shopOwner);
    } catch (error) {
      console.error('Error validating password:', error);
      throw error;
    }
  }

  static async setPasswordResetToken(email: string, token: string, expiresAt: Date): Promise<boolean> {
    try {
      const result = await query(
        `UPDATE shop_owners 
         SET password_reset_token = $1, password_reset_expires = $2 
         WHERE email = $3 AND is_active = true 
         RETURNING id`,
        [token, expiresAt, email]
      );

      return result.rows.length > 0;
    } catch (error) {
      console.error('Error setting password reset token:', error);
      throw error;
    }
  }

  static async findByPasswordResetToken(token: string): Promise<ShopOwner | null> {
    try {
      const result = await query(
        `SELECT * FROM shop_owners 
         WHERE password_reset_token = $1 
         AND password_reset_expires > CURRENT_TIMESTAMP 
         AND is_active = true`,
        [token]
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return this.mapRowToShopOwner(result.rows[0]);
    } catch (error) {
      console.error('Error fetching shop owner by reset token:', error);
      throw error;
    }
  }

  static async clearPasswordResetToken(id: string): Promise<void> {
    try {
      await query(
        'UPDATE shop_owners SET password_reset_token = NULL, password_reset_expires = NULL WHERE id = $1',
        [id]
      );
    } catch (error) {
      console.error('Error clearing password reset token:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      const result = await query(
        'UPDATE shop_owners SET is_active = false WHERE id = $1 RETURNING id',
        [id]
      );

      return result.rows.length > 0;
    } catch (error) {
      console.error('Error deleting shop owner:', error);
      throw error;
    }
  }

  private static mapRowToShopOwner(row: any): ShopOwner {
    return {
      id: row.id,
      email: row.email,
      password: '', // Never return password hash
      firstName: row.first_name,
      lastName: row.last_name,
      phone: row.phone || '',
      shopId: row.shop_id,
      role: row.role,
      isActive: row.is_active,
      lastLogin: row.last_login,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private static mapFieldToColumn(field: string): string | null {
    const fieldMap: { [key: string]: string } = {
      email: 'email',
      firstName: 'first_name',
      lastName: 'last_name',
      phone: 'phone',
      shopId: 'shop_id',
      role: 'role',
      isActive: 'is_active'
    };

    return fieldMap[field] || null;
  }
}