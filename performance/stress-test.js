// Stress Testing Configuration
// High-load testing to find system breaking points

const config = {
  target: process.env.API_URL || 'http://localhost:3001',
  phases: [
    {
      duration: '1m',
      arrivalRate: 10,
      name: 'Baseline'
    },
    {
      duration: '3m',
      arrivalRate: 50,
      name: 'Normal load'
    },
    {
      duration: '5m',
      arrivalRate: 100,
      name: 'High load'
    },
    {
      duration: '3m',
      arrivalRate: 200,
      name: 'Stress test'
    },
    {
      duration: '2m',
      arrivalRate: 500,
      name: 'Breaking point'
    },
    {
      duration: '2m',
      arrivalRate: 50,
      name: 'Recovery'
    }
  ],
  defaults: {
    headers: {
      'Content-Type': 'application/json'
    }
  },
  processor: './stress-processor.js'
};

const scenarios = [
  {
    name: 'Database Intensive',
    weight: 40,
    flow: [
      {
        function: 'authenticateUser'
      },
      {
        get: {
          url: '/api/v1/products?page=1&limit=50',
          headers: {
            'Authorization': 'Bearer {{ authToken }}'
          }
        }
      },
      {
        get: {
          url: '/api/v1/shops/analytics?period=7days',
          headers: {
            'Authorization': 'Bearer {{ authToken }}'
          }
        }
      },
      {
        get: {
          url: '/api/v1/products/search?q=electronics&category=all',
          headers: {
            'Authorization': 'Bearer {{ authToken }}'
          }
        }
      }
    ]
  },
  {
    name: 'CPU Intensive',
    weight: 30,
    flow: [
      {
        function: 'authenticateUser'
      },
      {
        post: {
          url: '/api/v1/products/batch',
          headers: {
            'Authorization': 'Bearer {{ authToken }}'
          },
          json: {
            products: [
              {
                name: 'Bulk Product 1 {{ $randomString() }}',
                name_ar: 'منتج مجمع 1 {{ $randomString() }}',
                price: '{{ $randomInt(10, 1000) }}',
                category: 'electronics'
              },
              {
                name: 'Bulk Product 2 {{ $randomString() }}',
                name_ar: 'منتج مجمع 2 {{ $randomString() }}',
                price: '{{ $randomInt(10, 1000) }}',
                category: 'fashion'
              }
            ]
          }
        }
      },
      {
        get: {
          url: '/api/v1/shops/reports/detailed',
          headers: {
            'Authorization': 'Bearer {{ authToken }}'
          }
        }
      }
    ]
  },
  {
    name: 'Memory Intensive',
    weight: 20,
    flow: [
      {
        function: 'authenticateUser'
      },
      {
        get: {
          url: '/api/v1/products/export?format=csv',
          headers: {
            'Authorization': 'Bearer {{ authToken }}'
          }
        }
      },
      {
        get: {
          url: '/api/v1/analytics/comprehensive',
          headers: {
            'Authorization': 'Bearer {{ authToken }}'
          }
        }
      }
    ]
  },
  {
    name: 'Concurrent Operations',
    weight: 10,
    flow: [
      {
        function: 'authenticateUser'
      },
      {
        parallel: [
          {
            get: {
              url: '/api/v1/products',
              headers: {
                'Authorization': 'Bearer {{ authToken }}'
              }
            }
          },
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
          }
        ]
      }
    ]
  }
];

module.exports = {
  config,
  scenarios
};