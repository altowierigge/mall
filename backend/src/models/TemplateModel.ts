import { ShopTemplate, ShopCustomization } from '../types/templates';

// Mock templates data
const mockTemplates: ShopTemplate[] = [
  {
    id: 'template-modern-1',
    name: 'Modern Elegance',
    description: 'Clean, modern design with sleek typography and minimal layout',
    category: 'modern',
    thumbnailUrl: '/templates/thumbnails/modern-elegance.jpg',
    previewUrl: '/templates/previews/modern-elegance.html',
    isActive: true,
    isPremium: false,
    configuration: {
      colors: {
        primary: '#2563eb',
        secondary: '#64748b',
        accent: '#f59e0b',
        background: '#ffffff',
        text: '#1f2937'
      },
      fonts: {
        heading: 'Inter, sans-serif',
        body: 'Inter, sans-serif'
      },
      layout: {
        style: 'grid',
        columns: 2,
        spacing: 'normal'
      },
      components: {
        showHeader: true,
        showSearch: true,
        showCategories: true,
        showFeatured: true,
        showOffers: true,
        showFooter: true
      },
      branding: {
        showLogo: true,
        logoPosition: 'left',
        showSlogan: true
      }
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'template-classic-1',
    name: 'Classic Retail',
    description: 'Traditional retail layout with warm colors and classic typography',
    category: 'classic',
    thumbnailUrl: '/templates/thumbnails/classic-retail.jpg',
    previewUrl: '/templates/previews/classic-retail.html',
    isActive: true,
    isPremium: false,
    configuration: {
      colors: {
        primary: '#dc2626',
        secondary: '#7c2d12',
        accent: '#fbbf24',
        background: '#fef7cd',
        text: '#451a03'
      },
      fonts: {
        heading: 'Georgia, serif',
        body: 'Georgia, serif'
      },
      layout: {
        style: 'list',
        columns: 1,
        spacing: 'spacious'
      },
      components: {
        showHeader: true,
        showSearch: true,
        showCategories: true,
        showFeatured: true,
        showOffers: true,
        showFooter: true
      },
      branding: {
        showLogo: true,
        logoPosition: 'center',
        showSlogan: true
      }
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'template-minimal-1',
    name: 'Minimal Clean',
    description: 'Ultra-minimal design focusing on products with maximum white space',
    category: 'minimal',
    thumbnailUrl: '/templates/thumbnails/minimal-clean.jpg',
    previewUrl: '/templates/previews/minimal-clean.html',
    isActive: true,
    isPremium: false,
    configuration: {
      colors: {
        primary: '#000000',
        secondary: '#6b7280',
        accent: '#000000',
        background: '#ffffff',
        text: '#111827'
      },
      fonts: {
        heading: 'Helvetica, sans-serif',
        body: 'Helvetica, sans-serif'
      },
      layout: {
        style: 'grid',
        columns: 1,
        spacing: 'spacious'
      },
      components: {
        showHeader: false,
        showSearch: false,
        showCategories: false,
        showFeatured: true,
        showOffers: false,
        showFooter: false
      },
      branding: {
        showLogo: true,
        logoPosition: 'center',
        showSlogan: false
      }
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'template-colorful-1',
    name: 'Vibrant Showcase',
    description: 'Bold and colorful design perfect for fashion and lifestyle brands',
    category: 'colorful',
    thumbnailUrl: '/templates/thumbnails/vibrant-showcase.jpg',
    previewUrl: '/templates/previews/vibrant-showcase.html',
    isActive: true,
    isPremium: false,
    configuration: {
      colors: {
        primary: '#ec4899',
        secondary: '#8b5cf6',
        accent: '#f59e0b',
        background: '#fef3c7',
        text: '#1f2937'
      },
      fonts: {
        heading: 'Poppins, sans-serif',
        body: 'Poppins, sans-serif'
      },
      layout: {
        style: 'carousel',
        columns: 2,
        spacing: 'compact'
      },
      components: {
        showHeader: true,
        showSearch: true,
        showCategories: true,
        showFeatured: true,
        showOffers: true,
        showFooter: true
      },
      branding: {
        showLogo: true,
        logoPosition: 'left',
        showSlogan: true
      }
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'template-premium-1',
    name: 'Luxury Gold',
    description: 'Premium luxury template with elegant gold accents and sophisticated layout',
    category: 'premium',
    thumbnailUrl: '/templates/thumbnails/luxury-gold.jpg',
    previewUrl: '/templates/previews/luxury-gold.html',
    isActive: true,
    isPremium: true,
    configuration: {
      colors: {
        primary: '#1f2937',
        secondary: '#6b7280',
        accent: '#f59e0b',
        background: '#f9fafb',
        text: '#111827'
      },
      fonts: {
        heading: 'Playfair Display, serif',
        body: 'Source Sans Pro, sans-serif'
      },
      layout: {
        style: 'grid',
        columns: 2,
        spacing: 'normal'
      },
      components: {
        showHeader: true,
        showSearch: true,
        showCategories: true,
        showFeatured: true,
        showOffers: true,
        showFooter: true
      },
      branding: {
        showLogo: true,
        logoPosition: 'center',
        showSlogan: true
      }
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// Mock customizations data
const mockCustomizations: ShopCustomization[] = [
  {
    shopId: 'shop-zara',
    templateId: 'template-modern-1',
    customizations: {
      colors: {
        primary: '#000000',
        accent: '#ffffff'
      },
      branding: {
        showSlogan: false
      }
    },
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  }
];

export class TemplateModel {
  static async findAll(): Promise<ShopTemplate[]> {
    return mockTemplates.filter(template => template.isActive);
  }

  static async findById(id: string): Promise<ShopTemplate | null> {
    return mockTemplates.find(template => template.id === id) || null;
  }

  static async findByCategory(category: ShopTemplate['category']): Promise<ShopTemplate[]> {
    return mockTemplates.filter(template => 
      template.category === category && template.isActive
    );
  }

  static async findPremiumTemplates(): Promise<ShopTemplate[]> {
    return mockTemplates.filter(template => 
      template.isPremium && template.isActive
    );
  }

  static async findFreeTemplates(): Promise<ShopTemplate[]> {
    return mockTemplates.filter(template => 
      !template.isPremium && template.isActive
    );
  }
}

export class CustomizationModel {
  static async findByShopId(shopId: string): Promise<ShopCustomization | null> {
    return mockCustomizations.find(custom => custom.shopId === shopId) || null;
  }

  static async create(customization: Omit<ShopCustomization, 'createdAt' | 'updatedAt'>): Promise<ShopCustomization> {
    const newCustomization: ShopCustomization = {
      ...customization,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Remove existing customization for the shop
    const existingIndex = mockCustomizations.findIndex(c => c.shopId === customization.shopId);
    if (existingIndex !== -1) {
      mockCustomizations.splice(existingIndex, 1);
    }
    
    mockCustomizations.push(newCustomization);
    return newCustomization;
  }

  static async update(shopId: string, updates: Partial<ShopCustomization>): Promise<ShopCustomization | null> {
    const customization = mockCustomizations.find(c => c.shopId === shopId);
    if (!customization) return null;

    Object.assign(customization, updates, { updatedAt: new Date() });
    return customization;
  }

  static async delete(shopId: string): Promise<boolean> {
    const index = mockCustomizations.findIndex(c => c.shopId === shopId);
    if (index === -1) return false;

    mockCustomizations.splice(index, 1);
    return true;
  }
}