import { Product } from '../types';

// Mock data for products
const products: Product[] = [
  {
    id: 'product-1',
    shopId: 'shop-1',
    name: 'Classic White T-Shirt',
    nameAr: 'تيشيرت أبيض كلاسيكي',
    description: 'Premium cotton white t-shirt with modern fit',
    descriptionAr: 'تيشيرت أبيض من القطن الفاخر بقصة عصرية',
    price: 89.99,
    salePrice: 69.99,
    category: 'T-Shirts',
    images: [
      'https://via.placeholder.com/400x400/ffffff/333333?text=White+T-Shirt',
      'https://via.placeholder.com/400x400/ffffff/333333?text=Back+View',
    ],
    inStock: true,
    stockQuantity: 50,
    isActive: true,
    isFeatured: true,
    tags: ['cotton', 'basic', 'white', 'unisex'],
    createdAt: new Date('2024-12-01T10:00:00Z'),
    updatedAt: new Date('2025-01-09T10:00:00Z'),
  },
  {
    id: 'product-2',
    shopId: 'shop-1',
    name: 'Denim Jeans',
    nameAr: 'جينز دينيم',
    description: 'Comfortable stretch denim jeans with slim fit',
    descriptionAr: 'جينز دينيم مريح مع قصة ضيقة',
    price: 149.99,
    category: 'Jeans',
    images: [
      'https://via.placeholder.com/400x400/4169E1/ffffff?text=Denim+Jeans',
    ],
    inStock: true,
    stockQuantity: 30,
    isActive: true,
    isFeatured: false,
    tags: ['denim', 'slim-fit', 'casual'],
    createdAt: new Date('2024-12-01T10:00:00Z'),
    updatedAt: new Date('2025-01-09T10:00:00Z'),
  },
  {
    id: 'product-3',
    shopId: 'shop-2',
    name: 'Summer Dress',
    nameAr: 'فستان صيفي',
    description: 'Lightweight floral summer dress',
    descriptionAr: 'فستان صيفي خفيف بنقشة الورود',
    price: 119.99,
    salePrice: 89.99,
    category: 'Dresses',
    images: [
      'https://via.placeholder.com/400x400/FFB6C1/ffffff?text=Summer+Dress',
    ],
    inStock: true,
    stockQuantity: 25,
    isActive: true,
    isFeatured: true,
    tags: ['floral', 'summer', 'lightweight'],
    createdAt: new Date('2024-12-01T10:00:00Z'),
    updatedAt: new Date('2025-01-09T10:00:00Z'),
  },
  {
    id: 'product-4',
    shopId: 'shop-3',
    name: 'Running Shoes',
    nameAr: 'أحذية الجري',
    description: 'High-performance running shoes with advanced cushioning',
    descriptionAr: 'أحذية جري عالية الأداء مع وسائد متقدمة',
    price: 299.99,
    category: 'Footwear',
    images: [
      'https://via.placeholder.com/400x400/000000/ffffff?text=Running+Shoes',
    ],
    inStock: true,
    stockQuantity: 40,
    isActive: true,
    isFeatured: true,
    tags: ['running', 'sport', 'cushioning'],
    createdAt: new Date('2024-12-01T10:00:00Z'),
    updatedAt: new Date('2025-01-09T10:00:00Z'),
  },
];

export class ProductModel {
  static async findByShopId(shopId: string): Promise<Product[]> {
    return products.filter(product => product.shopId === shopId && product.isActive);
  }

  static async findById(id: string): Promise<Product | null> {
    return products.find(product => product.id === id && product.isActive) || null;
  }

  static async create(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const newProduct: Product = {
      id: `product-${Date.now()}`,
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    products.push(newProduct);
    return newProduct;
  }

  static async update(id: string, updates: Partial<Product>): Promise<Product | null> {
    const productIndex = products.findIndex(product => product.id === id);
    if (productIndex === -1) return null;

    products[productIndex] = {
      ...products[productIndex],
      ...updates,
      updatedAt: new Date(),
    };

    return products[productIndex];
  }

  static async delete(id: string): Promise<boolean> {
    const productIndex = products.findIndex(product => product.id === id);
    if (productIndex === -1) return false;

    products[productIndex].isActive = false;
    products[productIndex].updatedAt = new Date();
    return true;
  }

  static async search(shopId: string, query: string): Promise<Product[]> {
    const shopProducts = products.filter(product => product.shopId === shopId && product.isActive);
    
    if (!query) return shopProducts;

    const searchQuery = query.toLowerCase();
    return shopProducts.filter(product => 
      product.name.toLowerCase().includes(searchQuery) ||
      product.description.toLowerCase().includes(searchQuery) ||
      product.category.toLowerCase().includes(searchQuery) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchQuery))
    );
  }

  static async getProductCount(shopId: string): Promise<number> {
    return products.filter(product => product.shopId === shopId && product.isActive).length;
  }

  static async getFeaturedProducts(shopId: string): Promise<Product[]> {
    return products.filter(product => 
      product.shopId === shopId && 
      product.isActive && 
      product.isFeatured
    );
  }

  static async getActiveProductCount(shopId: string): Promise<number> {
    return products.filter(product => 
      product.shopId === shopId && 
      product.isActive && 
      product.inStock
    ).length;
  }
}