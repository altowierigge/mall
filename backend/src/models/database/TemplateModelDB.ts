import { query } from '../../config/database';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnailUrl: string;
  previewUrl: string;
  isPremium: boolean;
  configuration: any;
  createdAt: Date;
  updatedAt: Date;
}

interface Customization {
  id: string;
  shopId: string;
  templateId: string;
  customizations: any;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class TemplateModelDB {
  static async findAll(): Promise<Template[]> {
    try {
      const result = await query(
        'SELECT * FROM templates WHERE is_active = true ORDER BY name'
      );
      return result.rows.map(this.mapRowToTemplate);
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
  }

  static async findById(id: string): Promise<Template | null> {
    try {
      const result = await query(
        'SELECT * FROM templates WHERE id = $1 AND is_active = true',
        [id]
      );
      return result.rows.length > 0 ? this.mapRowToTemplate(result.rows[0]) : null;
    } catch (error) {
      console.error('Error fetching template by ID:', error);
      throw error;
    }
  }

  static async findByCategory(category: string): Promise<Template[]> {
    try {
      const result = await query(
        'SELECT * FROM templates WHERE category = $1 AND is_active = true ORDER BY name',
        [category]
      );
      return result.rows.map(this.mapRowToTemplate);
    } catch (error) {
      console.error('Error fetching templates by category:', error);
      throw error;
    }
  }

  static async findPremiumTemplates(): Promise<Template[]> {
    try {
      const result = await query(
        'SELECT * FROM templates WHERE is_premium = true AND is_active = true ORDER BY name'
      );
      return result.rows.map(this.mapRowToTemplate);
    } catch (error) {
      console.error('Error fetching premium templates:', error);
      throw error;
    }
  }

  static async findFreeTemplates(): Promise<Template[]> {
    try {
      const result = await query(
        'SELECT * FROM templates WHERE is_premium = false AND is_active = true ORDER BY name'
      );
      return result.rows.map(this.mapRowToTemplate);
    } catch (error) {
      console.error('Error fetching free templates:', error);
      throw error;
    }
  }

  static async create(templateData: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>): Promise<Template> {
    try {
      const result = await query(
        `INSERT INTO templates (name, description, category, thumbnail_url, 
         preview_url, is_premium, configuration, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          templateData.name,
          templateData.description,
          templateData.category,
          templateData.thumbnailUrl,
          templateData.previewUrl,
          templateData.isPremium,
          JSON.stringify(templateData.configuration),
          true
        ]
      );
      return this.mapRowToTemplate(result.rows[0]);
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  }

  static async update(id: string, updates: Partial<Template>): Promise<Template | null> {
    try {
      const setClause = Object.keys(updates)
        .map((key, index) => `${key} = $${index + 2}`)
        .join(', ');
      
      const values = Object.values(updates);
      
      const result = await query(
        `UPDATE templates SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $1 RETURNING *`,
        [id, ...values]
      );
      
      return result.rows.length > 0 ? this.mapRowToTemplate(result.rows[0]) : null;
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      await query('UPDATE templates SET is_active = false WHERE id = $1', [id]);
      return true;
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  }

  private static mapRowToTemplate(row: any): Template {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      category: row.category,
      thumbnailUrl: row.thumbnail_url,
      previewUrl: row.preview_url,
      isPremium: row.is_premium,
      configuration: typeof row.configuration === 'string' ? JSON.parse(row.configuration) : row.configuration,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

export class CustomizationModelDB {
  static async findAll(): Promise<Customization[]> {
    try {
      const result = await query(
        'SELECT * FROM customizations WHERE is_active = true ORDER BY created_at DESC'
      );
      return result.rows.map(this.mapRowToCustomization);
    } catch (error) {
      console.error('Error fetching customizations:', error);
      throw error;
    }
  }

  static async findById(id: string): Promise<Customization | null> {
    try {
      const result = await query(
        'SELECT * FROM customizations WHERE id = $1 AND is_active = true',
        [id]
      );
      return result.rows.length > 0 ? this.mapRowToCustomization(result.rows[0]) : null;
    } catch (error) {
      console.error('Error fetching customization by ID:', error);
      throw error;
    }
  }

  static async findByShopId(shopId: string): Promise<Customization[]> {
    try {
      const result = await query(
        'SELECT * FROM customizations WHERE shop_id = $1 AND is_active = true ORDER BY created_at DESC',
        [shopId]
      );
      return result.rows.map(this.mapRowToCustomization);
    } catch (error) {
      console.error('Error fetching customizations by shop ID:', error);
      throw error;
    }
  }

  static async create(customizationData: Omit<Customization, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customization> {
    try {
      const result = await query(
        `INSERT INTO customizations (shop_id, template_id, customizations, is_active)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [
          customizationData.shopId,
          customizationData.templateId,
          JSON.stringify(customizationData.customizations),
          customizationData.isActive ?? true
        ]
      );
      return this.mapRowToCustomization(result.rows[0]);
    } catch (error) {
      console.error('Error creating customization:', error);
      throw error;
    }
  }

  static async update(id: string, updates: Partial<Customization>): Promise<Customization | null> {
    try {
      const setClause = Object.keys(updates)
        .map((key, index) => `${key} = $${index + 2}`)
        .join(', ');
      
      const values = Object.values(updates);
      
      const result = await query(
        `UPDATE customizations SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $1 RETURNING *`,
        [id, ...values]
      );
      
      return result.rows.length > 0 ? this.mapRowToCustomization(result.rows[0]) : null;
    } catch (error) {
      console.error('Error updating customization:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      await query('UPDATE customizations SET is_active = false WHERE id = $1', [id]);
      return true;
    } catch (error) {
      console.error('Error deleting customization:', error);
      throw error;
    }
  }

  private static mapRowToCustomization(row: any): Customization {
    return {
      id: row.id,
      shopId: row.shop_id,
      templateId: row.template_id,
      customizations: typeof row.customizations === 'string' ? JSON.parse(row.customizations) : row.customizations,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}