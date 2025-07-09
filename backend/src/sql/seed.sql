-- Mall App Seed Data
-- Production-ready sample data

-- Insert sample mall
INSERT INTO malls (id, name, name_ar, description, address, city, country, latitude, longitude, phone, email, website, hours) 
VALUES (
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    'Riyadh Park',
    'الرياض بارك',
    'Premium shopping destination in the heart of Riyadh',
    '1234 King Fahd Road, Riyadh',
    'Riyadh',
    'Saudi Arabia',
    24.7136,
    46.6753,
    '+966-11-123-4567',
    'info@riyadhpark.com',
    'https://riyadhpark.com',
    '{"monday": {"open": "10:00", "close": "23:00", "isClosed": false}, "tuesday": {"open": "10:00", "close": "23:00", "isClosed": false}, "wednesday": {"open": "10:00", "close": "23:00", "isClosed": false}, "thursday": {"open": "10:00", "close": "23:00", "isClosed": false}, "friday": {"open": "14:00", "close": "23:00", "isClosed": false}, "saturday": {"open": "10:00", "close": "23:00", "isClosed": false}, "sunday": {"open": "10:00", "close": "23:00", "isClosed": false}}'
) ON CONFLICT (id) DO NOTHING;

-- Insert sample shops
INSERT INTO shops (id, mall_id, name, name_ar, category, description, description_ar, icon_url, website_url, floor, zone, unit, phone, whatsapp, email, hours, subscription_tier, features) VALUES
(
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    'Zara',
    'زارا',
    'Fashion & Clothing',
    'International fashion retailer offering trendy clothing for men, women, and children',
    'متجر أزياء عالمي يقدم ملابس عصرية للرجال والنساء والأطفال',
    '/images/shops/zara-icon.png',
    'https://zara.com',
    'Ground Floor',
    'North Wing',
    'G-15',
    '+966-11-234-5678',
    '+966-50-234-5678',
    'riyadh@zara.com',
    '{"monday": {"open": "10:00", "close": "22:00", "isClosed": false}, "tuesday": {"open": "10:00", "close": "22:00", "isClosed": false}, "wednesday": {"open": "10:00", "close": "22:00", "isClosed": false}, "thursday": {"open": "10:00", "close": "22:00", "isClosed": false}, "friday": {"open": "14:00", "close": "22:00", "isClosed": false}, "saturday": {"open": "10:00", "close": "22:00", "isClosed": false}, "sunday": {"open": "10:00", "close": "22:00", "isClosed": false}}',
    'professional',
    '{"hasOnlineOrdering": true, "hasDelivery": true, "acceptsOnlinePayment": true}'
),
(
    'b2c3d4e5-f6g7-8901-bcde-f23456789012',
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    'H&M',
    'اتش اند ام',
    'Fashion & Clothing',
    'Swedish fashion retailer known for fast-fashion clothing for all ages',
    'متجر أزياء سويدي معروف بالأزياء السريعة لجميع الأعمار',
    '/images/shops/hm-icon.png',
    'https://hm.com',
    'Ground Floor',
    'South Wing',
    'G-22',
    '+966-11-345-6789',
    '+966-50-345-6789',
    'riyadh@hm.com',
    '{"monday": {"open": "10:00", "close": "22:00", "isClosed": false}, "tuesday": {"open": "10:00", "close": "22:00", "isClosed": false}, "wednesday": {"open": "10:00", "close": "22:00", "isClosed": false}, "thursday": {"open": "10:00", "close": "22:00", "isClosed": false}, "friday": {"open": "14:00", "close": "22:00", "isClosed": false}, "saturday": {"open": "10:00", "close": "22:00", "isClosed": false}, "sunday": {"open": "10:00", "close": "22:00", "isClosed": false}}',
    'professional',
    '{"hasOnlineOrdering": true, "hasDelivery": false, "acceptsOnlinePayment": true}'
),
(
    'c3d4e5f6-g7h8-9012-cdef-345678901234',
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    'Nike',
    'نايك',
    'Sports & Fitness',
    'Leading athletic footwear and apparel brand',
    'العلامة التجارية الرائدة للأحذية والملابس الرياضية',
    '/images/shops/nike-icon.png',
    'https://nike.com',
    'First Floor',
    'East Wing',
    'F-08',
    '+966-11-456-7890',
    '+966-50-456-7890',
    'riyadh@nike.com',
    '{"monday": {"open": "10:00", "close": "22:00", "isClosed": false}, "tuesday": {"open": "10:00", "close": "22:00", "isClosed": false}, "wednesday": {"open": "10:00", "close": "22:00", "isClosed": false}, "thursday": {"open": "10:00", "close": "22:00", "isClosed": false}, "friday": {"open": "14:00", "close": "22:00", "isClosed": false}, "saturday": {"open": "10:00", "close": "22:00", "isClosed": false}, "sunday": {"open": "10:00", "close": "22:00", "isClosed": false}}',
    'premium',
    '{"hasOnlineOrdering": true, "hasDelivery": true, "acceptsOnlinePayment": true}'
);

-- Insert shop owners
INSERT INTO shop_owners (id, shop_id, email, password_hash, first_name, last_name, phone) VALUES
(
    'd4e5f6g7-h8i9-0123-defg-456789012345',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'owner@zara.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyAOqmjUMsHxVG', -- password123
    'Ahmed',
    'Al-Rashid',
    '+966-50-123-4567'
),
(
    'e5f6g7h8-i9j0-1234-efgh-567890123456',
    'b2c3d4e5-f6g7-8901-bcde-f23456789012',
    'owner@hm.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyAOqmjUMsHxVG', -- password123
    'Sara',
    'Al-Zahra',
    '+966-50-234-5678'
),
(
    'f6g7h8i9-j0k1-2345-fghi-678901234567',
    'c3d4e5f6-g7h8-9012-cdef-345678901234',
    'owner@nike.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyAOqmjUMsHxVG', -- password123
    'Omar',
    'Al-Kindi',
    '+966-50-345-6789'
);

-- Insert sample products
INSERT INTO products (id, shop_id, name, name_ar, description, description_ar, price, category, images, stock_quantity, is_featured, tags) VALUES
(
    'g7h8i9j0-k1l2-3456-ghij-789012345678',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Basic White T-Shirt',
    'تيشيرت أبيض أساسي',
    'Classic white cotton t-shirt, perfect for everyday wear',
    'تيشيرت قطني أبيض كلاسيكي، مثالي للارتداء اليومي',
    29.99,
    'Clothing',
    '["/images/products/white-tshirt-1.jpg", "/images/products/white-tshirt-2.jpg"]',
    100,
    true,
    '["basic", "cotton", "white", "casual"]'
),
(
    'h8i9j0k1-l2m3-4567-hijk-890123456789',
    'b2c3d4e5-f6g7-8901-bcde-f23456789012',
    'Denim Jeans',
    'جينز دينيم',
    'Comfortable fit denim jeans in classic blue',
    'جينز دينيم مريح باللون الأزرق الكلاسيكي',
    79.99,
    'Clothing',
    '["/images/products/denim-jeans-1.jpg", "/images/products/denim-jeans-2.jpg"]',
    75,
    false,
    '["denim", "jeans", "blue", "casual"]'
),
(
    'i9j0k1l2-m3n4-5678-ijkl-901234567890',
    'c3d4e5f6-g7h8-9012-cdef-345678901234',
    'Air Max Sneakers',
    'حذاء إير ماكس الرياضي',
    'Nike Air Max running shoes with superior comfort and style',
    'حذاء جري نايك إير ماكس مع راحة وأناقة فائقة',
    149.99,
    'Footwear',
    '["/images/products/air-max-1.jpg", "/images/products/air-max-2.jpg", "/images/products/air-max-3.jpg"]',
    50,
    true,
    '["nike", "airmax", "running", "sneakers"]'
);

-- Insert sample templates
INSERT INTO templates (id, name, description, category, thumbnail_url, preview_url, is_premium, configuration) VALUES
(
    'j0k1l2m3-n4o5-6789-jklm-012345678901',
    'Modern Elegance',
    'Clean, modern design with sleek typography and minimal layout',
    'modern',
    '/templates/thumbnails/modern-elegance.jpg',
    '/templates/previews/modern-elegance.html',
    false,
    '{"colors": {"primary": "#2563eb", "secondary": "#64748b", "accent": "#f59e0b", "background": "#ffffff", "text": "#1f2937"}, "fonts": {"heading": "Inter, sans-serif", "body": "Inter, sans-serif"}, "layout": {"style": "grid", "columns": 2, "spacing": "normal"}, "components": {"showHeader": true, "showSearch": true, "showCategories": true, "showFeatured": true, "showOffers": true, "showFooter": true}, "branding": {"showLogo": true, "logoPosition": "left", "showSlogan": true}}'
),
(
    'k1l2m3n4-o5p6-7890-klmn-123456789012',
    'Classic Retail',
    'Traditional retail layout with warm colors and classic typography',
    'classic',
    '/templates/thumbnails/classic-retail.jpg',
    '/templates/previews/classic-retail.html',
    false,
    '{"colors": {"primary": "#dc2626", "secondary": "#7c2d12", "accent": "#fbbf24", "background": "#fef7cd", "text": "#451a03"}, "fonts": {"heading": "Georgia, serif", "body": "Georgia, serif"}, "layout": {"style": "list", "columns": 1, "spacing": "spacious"}, "components": {"showHeader": true, "showSearch": true, "showCategories": true, "showFeatured": true, "showOffers": true, "showFooter": true}, "branding": {"showLogo": true, "logoPosition": "center", "showSlogan": true}}'
),
(
    'l2m3n4o5-p6q7-8901-lmno-234567890123',
    'Luxury Gold',
    'Premium luxury template with elegant gold accents and sophisticated layout',
    'premium',
    '/templates/thumbnails/luxury-gold.jpg',
    '/templates/previews/luxury-gold.html',
    true,
    '{"colors": {"primary": "#1f2937", "secondary": "#6b7280", "accent": "#f59e0b", "background": "#f9fafb", "text": "#111827"}, "fonts": {"heading": "Playfair Display, serif", "body": "Source Sans Pro, sans-serif"}, "layout": {"style": "grid", "columns": 2, "spacing": "normal"}, "components": {"showHeader": true, "showSearch": true, "showCategories": true, "showFeatured": true, "showOffers": true, "showFooter": true}, "branding": {"showLogo": true, "logoPosition": "center", "showSlogan": true}}'
);

-- Insert sample analytics data
INSERT INTO analytics (id, shop_id, period, date_start, date_end, views, clicks, products_total, products_active, products_featured, chart_data) VALUES
(
    'm3n4o5p6-q7r8-9012-mnop-345678901234',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'weekly',
    '2025-01-01',
    '2025-01-07',
    1250,
    187,
    15,
    12,
    3,
    '{"labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], "views": [180, 165, 190, 175, 200, 220, 120], "clicks": [25, 22, 28, 24, 32, 35, 21], "revenue": [150, 200, 300, 250, 400, 500, 180]}'
),
(
    'n4o5p6q7-r8s9-0123-nopq-456789012345',
    'b2c3d4e5-f6g7-8901-bcde-f23456789012',
    'weekly',
    '2025-01-01',
    '2025-01-07',
    980,
    142,
    22,
    18,
    5,
    '{"labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], "views": [140, 120, 150, 135, 160, 180, 95], "clicks": [18, 15, 22, 19, 25, 28, 15], "revenue": [120, 180, 220, 190, 320, 380, 140]}'
);

-- Insert sample activity log
INSERT INTO activity_log (id, shop_id, type, title, description, metadata) VALUES
(
    'o5p6q7r8-s9t0-1234-opqr-567890123456',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'product_added',
    'New Product Added',
    'Basic White T-Shirt has been added to your shop',
    '{"product_id": "g7h8i9j0-k1l2-3456-ghij-789012345678", "product_name": "Basic White T-Shirt"}'
),
(
    'p6q7r8s9-t0u1-2345-pqrs-678901234567',
    'b2c3d4e5-f6g7-8901-bcde-f23456789012',
    'view',
    'Shop Viewed',
    'Your shop was viewed by a customer',
    '{"visitor_id": "anonymous", "page": "shop_home"}'
);

-- Insert sample offers
INSERT INTO offers (id, mall_id, shop_id, title, description, image_url, valid_from, valid_until, discount_percentage, is_featured) VALUES
(
    'q7r8s9t0-u1v2-3456-qrst-789012345678',
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'End of Season Sale',
    'Up to 50% off on selected items. Limited time offer!',
    '/images/offers/zara-sale.jpg',
    '2025-01-01 00:00:00',
    '2025-01-31 23:59:59',
    50,
    true
),
(
    'r8s9t0u1-v2w3-4567-rstu-890123456789',
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    'c3d4e5f6-g7h8-9012-cdef-345678901234',
    'New Arrivals',
    'Check out our latest Nike collection with free shipping',
    '/images/offers/nike-arrivals.jpg',
    '2025-01-01 00:00:00',
    '2025-02-28 23:59:59',
    0,
    true
);