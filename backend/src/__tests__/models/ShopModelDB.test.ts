import { ShopModelDB } from '../../models/database/ShopModelDB';
import { testPool } from '../setup';

describe('ShopModelDB', () => {
  const mockShop = {
    id: 'test-shop-id',
    mallId: 'test-mall-id',
    name: 'Test Shop',
    nameAr: 'متجر تجريبي',
    category: 'Fashion',
    description: 'Test shop description',
    descriptionAr: 'وصف متجر تجريبي',
    iconUrl: '/images/test-icon.png',
    websiteUrl: 'https://testshop.com',
    floor: 'Ground Floor',
    zone: 'North Wing',
    unit: 'G-01',
    phone: '+1234567890',
    whatsapp: '+1234567890',
    email: 'test@testshop.com',
    hours: {
      monday: { open: '09:00', close: '21:00', isClosed: false },
      tuesday: { open: '09:00', close: '21:00', isClosed: false },
      wednesday: { open: '09:00', close: '21:00', isClosed: false },
      thursday: { open: '09:00', close: '21:00', isClosed: false },
      friday: { open: '14:00', close: '21:00', isClosed: false },
      saturday: { open: '09:00', close: '21:00', isClosed: false },
      sunday: { open: '09:00', close: '21:00', isClosed: false }
    },
    subscriptionTier: 'professional',
    features: {
      hasOnlineOrdering: true,
      hasDelivery: true,
      acceptsOnlinePayment: true
    },
    isActive: true,
    isFeatured: false
  };

  beforeEach(async () => {
    // Create test table
    await testPool.query(`
      CREATE TABLE IF NOT EXISTS shops (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        mall_id UUID NOT NULL,
        name VARCHAR(255) NOT NULL,
        name_ar VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        description TEXT,
        description_ar TEXT,
        icon_url VARCHAR(500),
        website_url VARCHAR(500),
        floor VARCHAR(50),
        zone VARCHAR(50),
        unit VARCHAR(20),
        phone VARCHAR(20),
        whatsapp VARCHAR(20),
        email VARCHAR(255),
        hours JSONB,
        subscription_tier VARCHAR(50),
        features JSONB,
        is_active BOOLEAN DEFAULT true,
        is_featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  });

  afterEach(async () => {
    await testPool.query('DROP TABLE IF EXISTS shops');
  });

  describe('findAll', () => {
    it('should return all active shops', async () => {
      // Insert test data
      await testPool.query(`
        INSERT INTO shops (id, mall_id, name, name_ar, category, is_active)
        VALUES 
          ('${mockShop.id}', '${mockShop.mallId}', '${mockShop.name}', '${mockShop.nameAr}', '${mockShop.category}', true),
          ('test-shop-2', '${mockShop.mallId}', 'Test Shop 2', 'متجر تجريبي 2', 'Electronics', true),
          ('test-shop-3', '${mockShop.mallId}', 'Test Shop 3', 'متجر تجريبي 3', 'Food', false)
      `);

      const shops = await ShopModelDB.findAll();

      expect(shops).toHaveLength(2); // Only active shops
      expect(shops[0].name).toBe('Test Shop');
      expect(shops[1].name).toBe('Test Shop 2');
    });

    it('should return empty array when no shops exist', async () => {
      const shops = await ShopModelDB.findAll();
      expect(shops).toHaveLength(0);
    });
  });

  describe('findById', () => {
    it('should return shop by ID', async () => {
      await testPool.query(`
        INSERT INTO shops (id, mall_id, name, name_ar, category, is_active)
        VALUES ('${mockShop.id}', '${mockShop.mallId}', '${mockShop.name}', '${mockShop.nameAr}', '${mockShop.category}', true)
      `);

      const shop = await ShopModelDB.findById(mockShop.id);

      expect(shop).toBeTruthy();
      expect(shop?.name).toBe('Test Shop');
      expect(shop?.category).toBe('Fashion');
    });

    it('should return null for non-existent shop', async () => {
      const shop = await ShopModelDB.findById('non-existent-id');
      expect(shop).toBeNull();
    });
  });

  describe('findByMallId', () => {
    it('should return shops by mall ID', async () => {
      await testPool.query(`
        INSERT INTO shops (id, mall_id, name, name_ar, category, is_active)
        VALUES 
          ('${mockShop.id}', '${mockShop.mallId}', '${mockShop.name}', '${mockShop.nameAr}', '${mockShop.category}', true),
          ('test-shop-2', '${mockShop.mallId}', 'Test Shop 2', 'متجر تجريبي 2', 'Electronics', true),
          ('test-shop-3', 'different-mall', 'Test Shop 3', 'متجر تجريبي 3', 'Food', true)
      `);

      const shops = await ShopModelDB.findByMallId(mockShop.mallId);

      expect(shops).toHaveLength(2); // Only shops from specified mall
      expect(shops[0].mallId).toBe(mockShop.mallId);
      expect(shops[1].mallId).toBe(mockShop.mallId);
    });
  });

  describe('search', () => {
    it('should search shops by name', async () => {
      await testPool.query(`
        INSERT INTO shops (id, mall_id, name, name_ar, category, is_active)
        VALUES 
          ('${mockShop.id}', '${mockShop.mallId}', 'Fashion Store', 'متجر أزياء', 'Fashion', true),
          ('test-shop-2', '${mockShop.mallId}', 'Electronics Shop', 'متجر إلكترونيات', 'Electronics', true)
      `);

      const shops = await ShopModelDB.search(mockShop.mallId, 'Fashion');

      expect(shops).toHaveLength(1);
      expect(shops[0].name).toBe('Fashion Store');
    });

    it('should return empty array for no matches', async () => {
      const shops = await ShopModelDB.search(mockShop.mallId, 'NonExistent');
      expect(shops).toHaveLength(0);
    });
  });

  describe('create', () => {
    it('should create a new shop', async () => {
      const newShop = await ShopModelDB.create(mockShop);

      expect(newShop).toBeTruthy();
      expect(newShop.name).toBe(mockShop.name);
      expect(newShop.category).toBe(mockShop.category);
      expect(newShop.isActive).toBe(true);
    });
  });

  describe('update', () => {
    it('should update an existing shop', async () => {
      await testPool.query(`
        INSERT INTO shops (id, mall_id, name, name_ar, category, is_active)
        VALUES ('${mockShop.id}', '${mockShop.mallId}', '${mockShop.name}', '${mockShop.nameAr}', '${mockShop.category}', true)
      `);

      const updatedShop = await ShopModelDB.update(mockShop.id, {
        name: 'Updated Shop Name',
        category: 'Updated Category'
      });

      expect(updatedShop).toBeTruthy();
      expect(updatedShop?.name).toBe('Updated Shop Name');
      expect(updatedShop?.category).toBe('Updated Category');
    });

    it('should return null for non-existent shop', async () => {
      const updatedShop = await ShopModelDB.update('non-existent-id', {
        name: 'Updated Name'
      });

      expect(updatedShop).toBeNull();
    });
  });

  describe('delete', () => {
    it('should soft delete a shop', async () => {
      await testPool.query(`
        INSERT INTO shops (id, mall_id, name, name_ar, category, is_active)
        VALUES ('${mockShop.id}', '${mockShop.mallId}', '${mockShop.name}', '${mockShop.nameAr}', '${mockShop.category}', true)
      `);

      const result = await ShopModelDB.delete(mockShop.id);
      expect(result).toBe(true);

      // Verify shop is soft deleted
      const shop = await ShopModelDB.findById(mockShop.id);
      expect(shop).toBeNull(); // Should not find inactive shop
    });
  });
});