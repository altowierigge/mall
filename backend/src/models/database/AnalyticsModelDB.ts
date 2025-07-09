import { query } from '../../config/database';

interface Analytics {
  id: string;
  shopId: string;
  period: string;
  dateStart: Date;
  dateEnd: Date;
  views: number;
  clicks: number;
  productsTotal: number;
  productsActive: number;
  productsFeatured: number;
  chartData: any;
  createdAt: Date;
  updatedAt: Date;
}

export class AnalyticsModelDB {
  static async findAll(): Promise<Analytics[]> {
    try {
      const result = await query(
        'SELECT * FROM analytics ORDER BY date_start DESC'
      );
      return result.rows.map(this.mapRowToAnalytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }

  static async findById(id: string): Promise<Analytics | null> {
    try {
      const result = await query(
        'SELECT * FROM analytics WHERE id = $1',
        [id]
      );
      return result.rows.length > 0 ? this.mapRowToAnalytics(result.rows[0]) : null;
    } catch (error) {
      console.error('Error fetching analytics by ID:', error);
      throw error;
    }
  }

  static async findByShopId(shopId: string): Promise<Analytics[]> {
    try {
      const result = await query(
        'SELECT * FROM analytics WHERE shop_id = $1 ORDER BY date_start DESC',
        [shopId]
      );
      return result.rows.map(this.mapRowToAnalytics);
    } catch (error) {
      console.error('Error fetching analytics by shop ID:', error);
      throw error;
    }
  }

  static async findByShopIdAndPeriod(shopId: string, period: string): Promise<Analytics[]> {
    try {
      const result = await query(
        'SELECT * FROM analytics WHERE shop_id = $1 AND period = $2 ORDER BY date_start DESC',
        [shopId, period]
      );
      return result.rows.map(this.mapRowToAnalytics);
    } catch (error) {
      console.error('Error fetching analytics by shop ID and period:', error);
      throw error;
    }
  }

  static async create(analyticsData: Omit<Analytics, 'id' | 'createdAt' | 'updatedAt'>): Promise<Analytics> {
    try {
      const result = await query(
        `INSERT INTO analytics (shop_id, period, date_start, date_end, views, 
         clicks, products_total, products_active, products_featured, chart_data)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [
          analyticsData.shopId,
          analyticsData.period,
          analyticsData.dateStart,
          analyticsData.dateEnd,
          analyticsData.views,
          analyticsData.clicks,
          analyticsData.productsTotal,
          analyticsData.productsActive,
          analyticsData.productsFeatured,
          JSON.stringify(analyticsData.chartData)
        ]
      );
      return this.mapRowToAnalytics(result.rows[0]);
    } catch (error) {
      console.error('Error creating analytics:', error);
      throw error;
    }
  }

  static async update(id: string, updates: Partial<Analytics>): Promise<Analytics | null> {
    try {
      const setClause = Object.keys(updates)
        .map((key, index) => `${key} = $${index + 2}`)
        .join(', ');
      
      const values = Object.values(updates);
      
      const result = await query(
        `UPDATE analytics SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $1 RETURNING *`,
        [id, ...values]
      );
      
      return result.rows.length > 0 ? this.mapRowToAnalytics(result.rows[0]) : null;
    } catch (error) {
      console.error('Error updating analytics:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      await query('DELETE FROM analytics WHERE id = $1', [id]);
      return true;
    } catch (error) {
      console.error('Error deleting analytics:', error);
      throw error;
    }
  }

  private static mapRowToAnalytics(row: any): Analytics {
    return {
      id: row.id,
      shopId: row.shop_id,
      period: row.period,
      dateStart: row.date_start,
      dateEnd: row.date_end,
      views: row.views,
      clicks: row.clicks,
      productsTotal: row.products_total,
      productsActive: row.products_active,
      productsFeatured: row.products_featured,
      chartData: typeof row.chart_data === 'string' ? JSON.parse(row.chart_data) : row.chart_data,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}