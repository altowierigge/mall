// Load Testing Configuration
// Performance testing using Artillery.io

const config = {
  target: process.env.API_URL || 'http://localhost:3001',
  phases: [
    {
      duration: '2m',
      arrivalRate: 5,
      name: 'Warm up'
    },
    {
      duration: '5m',
      arrivalRate: 20,
      name: 'Load test'
    },
    {
      duration: '2m',
      arrivalRate: 50,
      name: 'Spike test'
    },
    {
      duration: '5m',
      arrivalRate: 30,
      name: 'Sustained load'
    }
  ],
  defaults: {
    headers: {
      'Content-Type': 'application/json'
    }
  }
};

const scenarios = [
  {
    name: 'Authentication Flow',
    weight: 30,
    flow: [
      {
        post: {
          url: '/api/v1/auth/login',
          json: {
            email: 'shop.owner@test.com',
            password: 'password123'
          },
          capture: {
            json: '$.token',
            as: 'authToken'
          }
        }
      },
      {
        get: {
          url: '/api/v1/auth/profile',
          headers: {
            'Authorization': 'Bearer {{ authToken }}'
          }
        }
      }
    ]
  },
  {
    name: 'Shop Management',
    weight: 25,
    flow: [
      {
        get: {
          url: '/api/v1/shops/profile',
          headers: {
            'Authorization': 'Bearer {{ authToken }}'
          }
        }
      },
      {
        get: {
          url: '/api/v1/shops/analytics',
          headers: {
            'Authorization': 'Bearer {{ authToken }}'
          }
        }
      },
      {
        get: {
          url: '/api/v1/shops/dashboard',
          headers: {
            'Authorization': 'Bearer {{ authToken }}'
          }
        }
      }
    ]
  },
  {
    name: 'Product Operations',
    weight: 35,
    flow: [
      {
        get: {
          url: '/api/v1/products',
          headers: {
            'Authorization': 'Bearer {{ authToken }}'
          }
        }
      },
      {
        post: {
          url: '/api/v1/products',
          headers: {
            'Authorization': 'Bearer {{ authToken }}'
          },
          json: {
            name: 'Test Product {{ $randomString() }}',
            name_ar: 'منتج تجريبي {{ $randomString() }}',
            description: 'Performance test product',
            price: '{{ $randomInt(10, 1000) }}',
            category: 'electronics',
            is_available: true
          },
          capture: {
            json: '$.data.id',
            as: 'productId'
          }
        }
      },
      {
        get: {
          url: '/api/v1/products/{{ productId }}',
          headers: {
            'Authorization': 'Bearer {{ authToken }}'
          }
        }
      }
    ]
  },
  {
    name: 'Public API',
    weight: 10,
    flow: [
      {
        get: {
          url: '/api/v1/health'
        }
      },
      {
        get: {
          url: '/api/v1/malls'
        }
      }
    ]
  }
];

// Artillery configuration
const artilleryConfig = {
  config,
  scenarios
};

module.exports = artilleryConfig;