#!/bin/bash

# Let's Encrypt SSL Certificate Setup Script
# This script sets up automatic SSL certificate generation and renewal

set -e

# Configuration
DOMAIN=${1:-"yourdomain.com"}
EMAIL=${2:-"admin@yourdomain.com"}
WEBROOT_PATH="/var/www/certbot"
CERT_PATH="/etc/letsencrypt/live/$DOMAIN"
NGINX_CONF="/etc/nginx/sites-available/default"

echo "🔐 Setting up Let's Encrypt SSL certificates for $DOMAIN"

# Install certbot if not already installed
if ! command -v certbot &> /dev/null; then
    echo "📦 Installing certbot..."
    if command -v apt-get &> /dev/null; then
        sudo apt-get update
        sudo apt-get install -y certbot python3-certbot-nginx
    elif command -v yum &> /dev/null; then
        sudo yum install -y certbot python3-certbot-nginx
    else
        echo "❌ Package manager not supported. Please install certbot manually."
        exit 1
    fi
fi

# Create webroot directory
sudo mkdir -p "$WEBROOT_PATH"

# Create temporary nginx configuration for certificate generation
cat > /tmp/nginx_temp.conf << EOF
server {
    listen 80;
    server_name $DOMAIN;
    
    location /.well-known/acme-challenge/ {
        root $WEBROOT_PATH;
    }
    
    location / {
        return 301 https://\$server_name\$request_uri;
    }
}
EOF

# Backup existing nginx configuration
if [ -f "$NGINX_CONF" ]; then
    sudo cp "$NGINX_CONF" "$NGINX_CONF.backup"
fi

# Apply temporary configuration
sudo cp /tmp/nginx_temp.conf "$NGINX_CONF"
sudo nginx -t && sudo systemctl reload nginx

# Generate SSL certificate
echo "🌐 Generating SSL certificate for $DOMAIN..."
sudo certbot certonly \
    --webroot \
    --webroot-path="$WEBROOT_PATH" \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    --domains "$DOMAIN"

# Verify certificate was generated
if [ ! -f "$CERT_PATH/fullchain.pem" ]; then
    echo "❌ Certificate generation failed!"
    exit 1
fi

# Create production nginx configuration with SSL
cat > /tmp/nginx_ssl.conf << EOF
server {
    listen 80;
    server_name $DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN;

    ssl_certificate $CERT_PATH/fullchain.pem;
    ssl_certificate_key $CERT_PATH/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_session_tickets off;
    ssl_stapling on;
    ssl_stapling_verify on;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Your application configuration goes here
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Apply SSL configuration
sudo cp /tmp/nginx_ssl.conf "$NGINX_CONF"
sudo nginx -t && sudo systemctl reload nginx

# Setup automatic renewal
echo "🔄 Setting up automatic certificate renewal..."
sudo crontab -l | grep -v 'certbot renew' | sudo crontab -
(sudo crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet --post-hook 'systemctl reload nginx'") | sudo crontab -

# Test renewal
echo "🧪 Testing certificate renewal..."
sudo certbot renew --dry-run

echo "✅ SSL certificate setup completed successfully!"
echo "🔒 Certificate location: $CERT_PATH"
echo "🔄 Automatic renewal configured"
echo "🌐 Your site is now available at: https://$DOMAIN"

# Clean up temporary files
rm -f /tmp/nginx_temp.conf /tmp/nginx_ssl.conf

echo ""
echo "📋 Next steps:"
echo "1. Update your DNS records to point to this server"
echo "2. Test your SSL configuration at: https://www.ssllabs.com/ssltest/"
echo "3. Update your application configuration to use HTTPS"