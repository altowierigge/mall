#!/bin/bash

# SSL Certificate Generation Script
# This script generates self-signed certificates for development
# For production, use certificates from a CA like Let's Encrypt

set -e

# Configuration
CERT_DIR="/etc/nginx/ssl"
COUNTRY="SA"
STATE="Riyadh"
CITY="Riyadh"
ORGANIZATION="Mall App"
ORGANIZATIONAL_UNIT="IT Department"
COMMON_NAME="localhost"
EMAIL="admin@mallapp.com"

# Create SSL directory
mkdir -p "$CERT_DIR"

echo "🔐 Generating SSL certificates..."

# Generate private key
openssl genrsa -out "$CERT_DIR/key.pem" 2048

# Generate certificate signing request
openssl req -new -key "$CERT_DIR/key.pem" -out "$CERT_DIR/csr.pem" -subj "/C=$COUNTRY/ST=$STATE/L=$CITY/O=$ORGANIZATION/OU=$ORGANIZATIONAL_UNIT/CN=$COMMON_NAME/emailAddress=$EMAIL"

# Generate self-signed certificate
openssl x509 -req -days 365 -in "$CERT_DIR/csr.pem" -signkey "$CERT_DIR/key.pem" -out "$CERT_DIR/cert.pem"

# Set appropriate permissions
chmod 600 "$CERT_DIR/key.pem"
chmod 644 "$CERT_DIR/cert.pem"

# Clean up CSR file
rm "$CERT_DIR/csr.pem"

echo "✅ SSL certificates generated successfully!"
echo "📁 Certificate: $CERT_DIR/cert.pem"
echo "🔑 Private key: $CERT_DIR/key.pem"
echo ""
echo "⚠️  Note: These are self-signed certificates for development only."
echo "   For production, use certificates from a trusted CA like Let's Encrypt."
echo ""
echo "🚀 To use with Docker:"
echo "   docker run -v $CERT_DIR:/etc/nginx/ssl nginx:alpine"