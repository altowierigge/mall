# Mall API Backend

## Overview
Backend API server for the Native Mall App, providing endpoints for shops, offers, and mall information.

## Tech Stack
- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **Mock Data** for development (will be replaced with database)

## API Endpoints

### Health Check
- `GET /api/v1/health` - API health status

### Malls
- `GET /api/v1/malls` - Get all malls
- `GET /api/v1/malls/:mallId` - Get mall information

### Shops
- `GET /api/v1/malls/:mallId/shops` - Get all shops
- `GET /api/v1/malls/:mallId/shops/featured` - Get featured shops
- `GET /api/v1/malls/:mallId/shops/search?q=query` - Search shops
- `GET /api/v1/malls/:mallId/shops/:shopId` - Get specific shop
- `GET /api/v1/malls/:mallId/categories` - Get shop categories

### Offers
- `GET /api/v1/malls/:mallId/offers` - Get all offers
- `GET /api/v1/malls/:mallId/offers/:offerId` - Get specific offer

## Development

### Setup
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Run Production
```bash
npm start
```

## Environment Variables
```
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## Current Status
- ✅ Basic Express server setup
- ✅ TypeScript configuration
- ✅ Mock data implementation
- ✅ API endpoints for Sprint 1 requirements
- ✅ Error handling middleware
- ✅ CORS and security middleware

## Future Enhancements
- Database integration (Sprint 2)
- Authentication middleware
- Rate limiting
- Caching strategy
- API documentation (Swagger)
- Testing suite