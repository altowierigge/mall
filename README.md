# Mall Shop Admin System

A comprehensive mall management system featuring a native mobile app for customers and a web-based admin dashboard for shop owners.

## 🏗️ Architecture

### Frontend
- **Mobile App**: React Native (iOS/Android) - Customer interface
- **Admin Dashboard**: React.js with TypeScript - Shop owner interface
- **UI Framework**: Material-UI with responsive design
- **State Management**: Redux Toolkit with RTK Query

### Backend
- **API Server**: Express.js with TypeScript
- **Database**: PostgreSQL with connection pooling
- **Authentication**: JWT with refresh tokens
- **File Storage**: Local storage with cloud-ready architecture
- **Caching**: Redis for session management

### Infrastructure
- **Containerization**: Docker with multi-stage builds
- **Reverse Proxy**: Nginx with SSL termination
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **CI/CD**: GitHub Actions with automated testing

## 🚀 Features

### For Shop Owners
- **Dashboard**: Real-time analytics and metrics
- **Product Management**: Full CRUD operations with image uploads
- **Shop Customization**: Templates and theme customization
- **Analytics**: Views, clicks, and revenue tracking
- **Profile Management**: Shop information and settings

### For Customers (Mobile App)
- **Mall Directory**: Browse shops and categories
- **Search & Filter**: Find shops and products
- **Shop Details**: View shop information and products
- **Navigation**: Interactive mall maps
- **Offers**: Special deals and promotions

### For Administrators
- **Mall Management**: Multiple mall support
- **User Management**: Shop owner accounts
- **Content Management**: Offers and announcements
- **Analytics**: System-wide metrics
- **Security**: Role-based access control

## 🛠️ Technology Stack

### Frontend Technologies
```typescript
- React.js 18+ with TypeScript
- Material-UI v5 Design System
- Redux Toolkit + RTK Query
- React Hook Form with Yup validation
- React Router for navigation
- Chart.js for analytics visualization
- Axios for API communication
```

### Backend Technologies
```typescript
- Node.js 18+ with TypeScript
- Express.js web framework
- PostgreSQL database
- Redis for caching
- JWT authentication
- Multer for file uploads
- Helmet for security headers
- Rate limiting and input validation
```

### DevOps & Infrastructure
```yaml
- Docker containerization
- Nginx reverse proxy
- GitHub Actions CI/CD
- Prometheus monitoring
- Grafana dashboards
- ELK Stack logging
- SSL/TLS encryption
```

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose
- PostgreSQL 15+
- Redis 7+

### Quick Start
```bash
# Clone the repository
git clone https://github.com/your-username/mall-shop-admin.git
cd mall-shop-admin

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Start with Docker Compose
docker-compose up -d

# Initialize database
docker-compose exec backend npm run db:migrate
docker-compose exec backend npm run db:seed

# Access the applications
# Admin Dashboard: http://localhost:3000
# API Server: http://localhost:3001
# Monitoring: http://localhost:3003 (Grafana)
```

### Manual Installation
```bash
# Backend setup
cd backend
npm install
npm run build
npm run db:migrate
npm run db:seed
npm start

# Frontend setup
cd shop-admin-dashboard
npm install
npm run build
npm start
```

## 🔧 Configuration

### Environment Variables
```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mall_app_production
DB_USER=mall_user
DB_PASSWORD=your_secure_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key

# Application
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
REACT_APP_API_URL=https://api.yourdomain.com
```

### SSL Configuration
```bash
# Generate self-signed certificates (development)
cd nginx/ssl
./generate-certs.sh

# Setup Let's Encrypt (production)
./scripts/setup-letsencrypt.sh yourdomain.com admin@yourdomain.com
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test                    # Run all tests
npm run test:watch          # Watch mode
npm run test:coverage       # Coverage report
npm run lint               # Code linting
npm run typecheck          # Type checking
```

### Frontend Testing
```bash
cd shop-admin-dashboard
npm test                    # Run all tests
npm run test:coverage       # Coverage report
npm run lint               # Code linting
npm run typecheck          # Type checking
```

### Integration Testing
```bash
# Start test environment
docker-compose -f docker-compose.test.yml up -d

# Run integration tests
npm run test:integration

# Performance testing
npm run test:performance
```

## 📊 Database Schema

### Core Tables
```sql
-- Malls
CREATE TABLE malls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    -- ... other fields
);

-- Shops
CREATE TABLE shops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mall_id UUID NOT NULL REFERENCES malls(id),
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    -- ... other fields
);

-- Products
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES shops(id),
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    price DECIMAL(10,2),
    -- ... other fields
);
```

## 🚦 API Documentation

### Authentication Endpoints
```typescript
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
GET  /api/v1/auth/profile
```

### Shop Management
```typescript
GET    /api/v1/shops/profile
PUT    /api/v1/shops/profile
GET    /api/v1/shops/analytics
GET    /api/v1/shops/dashboard
```

### Product Management
```typescript
GET    /api/v1/products
POST   /api/v1/products
GET    /api/v1/products/:id
PUT    /api/v1/products/:id
DELETE /api/v1/products/:id
```

### File Upload
```typescript
POST   /api/v1/upload/shop-icon
POST   /api/v1/upload/product-image
```

## 🔐 Security Features

### Security Measures
- **Authentication**: JWT with refresh tokens
- **Rate Limiting**: API endpoint protection
- **Input Validation**: XSS and injection prevention
- **CORS**: Cross-origin request security
- **HTTPS**: SSL/TLS encryption
- **Security Headers**: Helmet.js integration
- **SQL Injection**: Parameterized queries
- **File Upload**: Type and size validation

### Security Headers
```typescript
- Strict-Transport-Security
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Content-Security-Policy
- Referrer-Policy
```

## 📈 Monitoring

### Metrics Collection
- **Application Metrics**: Response times, error rates
- **System Metrics**: CPU, memory, disk usage
- **Database Metrics**: Query performance, connections
- **User Metrics**: Authentication, activity tracking

### Dashboards
- **Grafana**: System and application monitoring
- **Kibana**: Log analysis and visualization
- **Prometheus**: Metrics collection and alerting

## 🚀 Deployment

### Docker Deployment
```bash
# Production deployment
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Health checks
curl https://yourdomain.com/health
curl https://yourdomain.com/api/v1/health
```

### CI/CD Pipeline
```yaml
# GitHub Actions workflow
- Code quality checks
- Security scanning
- Automated testing
- Docker image building
- Production deployment
- Health verification
```

## 🔧 Development

### Project Structure
```
mall-shop-admin/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── models/         # Database models
│   │   ├── middleware/     # Custom middleware
│   │   ├── config/         # Configuration files
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   ├── Dockerfile
│   └── package.json
├── shop-admin-dashboard/    # React admin interface
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux store
│   │   ├── services/       # API services
│   │   └── types/          # TypeScript types
│   ├── Dockerfile
│   └── package.json
├── nginx/                   # Nginx configuration
├── monitoring/              # Monitoring configs
├── scripts/                 # Deployment scripts
├── .github/workflows/       # CI/CD pipelines
└── docker-compose.yml
```

### Development Workflow
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Backend development
cd backend
npm run dev

# Frontend development
cd shop-admin-dashboard
npm start

# Run tests
npm run test:all
```

## 📚 Documentation

### Available Documentation
- [API Documentation](./docs/api.md)
- [Database Schema](./docs/database.md)
- [Deployment Guide](./docs/deployment.md)
- [Security Guide](./docs/security.md)
- [Contributing Guidelines](./CONTRIBUTING.md)

## 🤝 Contributing

### Development Process
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Code formatting
- **Jest**: Testing framework
- **Conventional Commits**: Commit message format

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- **Issues**: Report bugs on GitHub Issues
- **Documentation**: Check the docs/ directory
- **Community**: Join our discussions
- **Email**: support@mallapp.com

### System Requirements
- **Node.js**: 18+ LTS
- **Docker**: 20.10+
- **PostgreSQL**: 15+
- **Redis**: 7+
- **Memory**: 4GB minimum
- **Storage**: 20GB minimum

---

Built with ❤️ for modern mall management systems.