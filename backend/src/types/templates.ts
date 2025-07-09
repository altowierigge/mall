export interface ShopTemplate {
  id: string;
  name: string;
  description: string;
  category: 'modern' | 'classic' | 'minimal' | 'colorful' | 'premium';
  thumbnailUrl: string;
  previewUrl: string;
  isActive: boolean;
  isPremium: boolean;
  configuration: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
    };
    fonts: {
      heading: string;
      body: string;
    };
    layout: {
      style: 'grid' | 'list' | 'carousel';
      columns: number;
      spacing: 'compact' | 'normal' | 'spacious';
    };
    components: {
      showHeader: boolean;
      showSearch: boolean;
      showCategories: boolean;
      showFeatured: boolean;
      showOffers: boolean;
      showFooter: boolean;
    };
    branding: {
      showLogo: boolean;
      logoPosition: 'left' | 'center' | 'right';
      showSlogan: boolean;
      customCSS?: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ShopCustomization {
  shopId: string;
  templateId: string;
  customizations: {
    colors?: Partial<ShopTemplate['configuration']['colors']>;
    fonts?: Partial<ShopTemplate['configuration']['fonts']>;
    layout?: Partial<ShopTemplate['configuration']['layout']>;
    components?: Partial<ShopTemplate['configuration']['components']>;
    branding?: Partial<ShopTemplate['configuration']['branding']>;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplatePreview {
  templateId: string;
  shopData: {
    name: string;
    description: string;
    iconUrl: string;
    products: Array<{
      id: string;
      name: string;
      price: number;
      imageUrl: string;
    }>;
  };
  customizations?: ShopCustomization['customizations'];
}