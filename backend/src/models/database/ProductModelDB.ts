import { query } from '../../config/database';
import { Product } from '../../types/index';

export class ProductModelDB {
  static async findByShopId(shopId: string): Promise<Product[]> {
    try {
      const result = await query(
        'SELECT * FROM products WHERE shop_id = $1 AND is_active = true ORDER BY created_at DESC',
        [shopId]
      );
      
      return result.rows.map(this.mapRowToProduct);
    } catch (error) {
      console.error('Error fetching products by shop ID:', error);
      throw error;
    }
  }

  static async search(shopId: string, searchQuery: string): Promise<Product[]> {
    try {
      const result = await query(
        `SELECT * FROM products 
         WHERE shop_id = $1 AND is_active = true 
         AND (name ILIKE $2 OR name_ar ILIKE $2 OR description ILIKE $2)
         ORDER BY created_at DESC`,
        [shopId, `%${searchQuery}%`]
      );
      
      return result.rows.map(this.mapRowToProduct);
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  static async findById(id: string): Promise<Product | null> {
    try {
      const result = await query(
        'SELECT * FROM products WHERE id = $1 AND is_active = true',
        [id]
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return this.mapRowToProduct(result.rows[0]);
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      throw error;
    }
  }

  static async findByCategory(category: string): Promise<Product[]> {
    try {
      const result = await query(
        'SELECT * FROM products WHERE category = $1 AND is_active = true ORDER BY created_at DESC',
        [category]
      );
      
      return result.rows.map(this.mapRowToProduct);
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  }

  static async findFeatured(limit = 10): Promise<Product[]> {
    try {
      const result = await query(
        'SELECT * FROM products WHERE is_featured = true AND is_active = true ORDER BY created_at DESC LIMIT $1',
        [limit]
      );
      
      return result.rows.map(this.mapRowToProduct);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  }

  static async getProductCount(shopId: string): Promise<number> {
    try {
      const result = await query(
        'SELECT COUNT(*) FROM products WHERE shop_id = $1 AND is_active = true',
        [shopId]
      );
      
      return parseInt(result.rows[0].count);
    } catch (error) {
      console.error('Error getting product count:', error);
      throw error;
    }
  }

  static async getActiveProductCount(shopId: string): Promise<number> {
    try {
      const result = await query(
        'SELECT COUNT(*) FROM products WHERE shop_id = $1 AND is_active = true',
        [shopId]
      );
      
      return parseInt(result.rows[0].count);
    } catch (error) {
      console.error('Error getting active product count:', error);
      throw error;
    }
  }

  static async getFeaturedProducts(shopId: string): Promise<Product[]> {
    try {
      const result = await query(
        'SELECT * FROM products WHERE shop_id = $1 AND is_featured = true AND is_active = true ORDER BY created_at DESC',
        [shopId]
      );
      
      return result.rows.map(this.mapRowToProduct);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  }

  static async getFeaturedCount(shopId: string): Promise<number> {
    try {
      const result = await query(
        'SELECT COUNT(*) FROM products WHERE shop_id = $1 AND is_featured = true AND is_active = true',
        [shopId]
      );
      
      return parseInt(result.rows[0].count);
    } catch (error) {
      console.error('Error getting featured product count:', error);
      throw error;
    }
  }

  static async create(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    try {
      const result = await query(
        `INSERT INTO products (shop_id, name, name_ar, description, description_ar, 
         price, category, images, stock_quantity, is_featured, is_active, tags)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         RETURNING *`,
        [
          productData.shopId,
          productData.name,
          productData.nameAr,
          productData.description,
          productData.descriptionAr,
          productData.price,
          productData.category,
          JSON.stringify(productData.images || []),
          productData.stockQuantity,
          productData.isFeatured ?? false,
          productData.isActive ?? true,
          JSON.stringify(productData.tags || [])
        ]
      );
      
      return this.mapRowToProduct(result.rows[0]);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  static async update(id: string, updates: Partial<Product>): Promise<Product | null> {
    try {
      const setClause = Object.keys(updates)
        .map((key, index) => `${key} = $${index + 2}`)
        .join(', ');
      
      const values = Object.values(updates);
      
      const result = await query(
        `UPDATE products SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $1 RETURNING *`,
        [id, ...values]
      );
      
      return result.rows.length > 0 ? this.mapRowToProduct(result.rows[0]) : null;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      await query('UPDATE products SET is_active = false WHERE id = $1', [id]);
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  private static mapRowToProduct(row: any): Product {
    return {
      id: row.id,
      shopId: row.shop_id,
      name: row.name,
      nameAr: row.name_ar,
      description: row.description,
      descriptionAr: row.description_ar,
      price: row.price,
      category: row.category,
      images: typeof row.images === 'string' ? JSON.parse(row.images) : row.images,
      inStock: row.stock_quantity > 0,
      stockQuantity: row.stock_quantity,
      isFeatured: row.is_featured ?? false,
      isActive: row.is_active,
      tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}