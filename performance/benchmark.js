// Performance Benchmark Suite
// Automated performance testing and benchmarking

const { performance } = require('perf_hooks');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

class PerformanceBenchmark {
  constructor(baseURL = 'http://localhost:3001') {
    this.baseURL = baseURL;
    this.results = {
      timestamp: new Date().toISOString(),
      testSuite: 'Mall Admin System Benchmark',
      environment: process.env.NODE_ENV || 'development',
      tests: []
    };
    this.authToken = null;
  }

  async authenticate() {
    try {
      const response = await axios.post(`${this.baseURL}/api/v1/auth/login`, {
        email: 'shop.owner@test.com',
        password: 'password123'
      });
      this.authToken = response.data.token;
      return true;
    } catch (error) {
      console.error('Authentication failed:', error.message);
      return false;
    }
  }

  async measureOperation(name, operation, iterations = 100) {
    const results = [];
    let successCount = 0;
    let errorCount = 0;

    console.log(`\n🔄 Running ${name} (${iterations} iterations)...`);

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      try {
        await operation();
        const end = performance.now();
        const duration = end - start;
        results.push(duration);
        successCount++;
      } catch (error) {
        errorCount++;
        console.error(`Error in iteration ${i + 1}:`, error.message);
      }
    }

    const stats = this.calculateStats(results);
    const testResult = {
      name,
      iterations,
      successCount,
      errorCount,
      successRate: (successCount / iterations) * 100,
      ...stats
    };

    this.results.tests.push(testResult);
    this.printTestResult(testResult);
    return testResult;
  }

  calculateStats(results) {
    if (results.length === 0) return { avg: 0, min: 0, max: 0, p95: 0, p99: 0 };

    const sorted = results.sort((a, b) => a - b);
    const avg = results.reduce((sum, val) => sum + val, 0) / results.length;
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const p95 = sorted[Math.floor(sorted.length * 0.95)];
    const p99 = sorted[Math.floor(sorted.length * 0.99)];

    return {
      avg: Math.round(avg * 100) / 100,
      min: Math.round(min * 100) / 100,
      max: Math.round(max * 100) / 100,
      p95: Math.round(p95 * 100) / 100,
      p99: Math.round(p99 * 100) / 100
    };
  }

  printTestResult(result) {
    console.log(`✅ ${result.name}:`);
    console.log(`   Success Rate: ${result.successRate.toFixed(1)}%`);
    console.log(`   Average: ${result.avg}ms`);
    console.log(`   Min: ${result.min}ms | Max: ${result.max}ms`);
    console.log(`   P95: ${result.p95}ms | P99: ${result.p99}ms`);
  }

  async runBenchmarks() {
    console.log('🚀 Starting Performance Benchmarks...');
    
    // Authenticate first
    if (!await this.authenticate()) {
      console.error('❌ Authentication failed. Exiting...');
      return;
    }

    const headers = {
      'Authorization': `Bearer ${this.authToken}`,
      'Content-Type': 'application/json'
    };

    // Test 1: Authentication Performance
    await this.measureOperation('Authentication', async () => {
      await axios.post(`${this.baseURL}/api/v1/auth/login`, {
        email: 'shop.owner@test.com',
        password: 'password123'
      });
    }, 50);

    // Test 2: Shop Profile Retrieval
    await this.measureOperation('Shop Profile Retrieval', async () => {
      await axios.get(`${this.baseURL}/api/v1/shops/profile`, { headers });
    });

    // Test 3: Products List
    await this.measureOperation('Products List', async () => {
      await axios.get(`${this.baseURL}/api/v1/products`, { headers });
    });

    // Test 4: Product Creation
    await this.measureOperation('Product Creation', async () => {
      const productData = {
        name: `Benchmark Product ${Math.random().toString(36).substr(2, 9)}`,
        name_ar: `منتج معياري ${Math.random().toString(36).substr(2, 9)}`,
        description: 'Benchmark test product',
        price: Math.floor(Math.random() * 1000) + 10,
        category: 'electronics',
        is_available: true
      };
      await axios.post(`${this.baseURL}/api/v1/products`, productData, { headers });
    }, 30);

    // Test 5: Analytics Query
    await this.measureOperation('Analytics Query', async () => {
      await axios.get(`${this.baseURL}/api/v1/shops/analytics`, { headers });
    }, 20);

    // Test 6: Dashboard Data
    await this.measureOperation('Dashboard Data', async () => {
      await axios.get(`${this.baseURL}/api/v1/shops/dashboard`, { headers });
    }, 50);

    // Test 7: Product Search
    await this.measureOperation('Product Search', async () => {
      await axios.get(`${this.baseURL}/api/v1/products/search?q=electronics`, { headers });
    }, 30);

    // Test 8: Health Check
    await this.measureOperation('Health Check', async () => {
      await axios.get(`${this.baseURL}/api/v1/health`);
    });

    this.generateReport();
  }

  generateReport() {
    const reportPath = path.join(__dirname, 'reports', `benchmark-${Date.now()}.json`);
    
    // Create reports directory if it doesn't exist
    const reportsDir = path.join(__dirname, 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    // Save detailed JSON report
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));

    // Generate summary report
    const summaryPath = path.join(__dirname, 'reports', `summary-${Date.now()}.md`);
    const summary = this.generateSummaryReport();
    fs.writeFileSync(summaryPath, summary);

    console.log('\n📊 Performance Benchmark Complete!');
    console.log(`📁 Detailed Report: ${reportPath}`);
    console.log(`📄 Summary Report: ${summaryPath}`);

    this.printSummary();
  }

  generateSummaryReport() {
    const totalTests = this.results.tests.length;
    const avgSuccessRate = this.results.tests.reduce((sum, test) => sum + test.successRate, 0) / totalTests;
    const avgResponseTime = this.results.tests.reduce((sum, test) => sum + test.avg, 0) / totalTests;

    let summary = `# Performance Benchmark Summary\n\n`;
    summary += `**Test Suite:** ${this.results.testSuite}\n`;
    summary += `**Timestamp:** ${this.results.timestamp}\n`;
    summary += `**Environment:** ${this.results.environment}\n`;
    summary += `**Total Tests:** ${totalTests}\n`;
    summary += `**Average Success Rate:** ${avgSuccessRate.toFixed(1)}%\n`;
    summary += `**Average Response Time:** ${avgResponseTime.toFixed(2)}ms\n\n`;

    summary += `## Test Results\n\n`;
    summary += `| Test Name | Success Rate | Avg (ms) | Min (ms) | Max (ms) | P95 (ms) | P99 (ms) |\n`;
    summary += `|-----------|--------------|----------|----------|----------|----------|----------|\n`;

    this.results.tests.forEach(test => {
      summary += `| ${test.name} | ${test.successRate.toFixed(1)}% | ${test.avg} | ${test.min} | ${test.max} | ${test.p95} | ${test.p99} |\n`;
    });

    summary += `\n## Performance Analysis\n\n`;
    
    // Performance recommendations
    const slowTests = this.results.tests.filter(test => test.avg > 500);
    if (slowTests.length > 0) {
      summary += `### ⚠️ Slow Operations (>500ms)\n`;
      slowTests.forEach(test => {
        summary += `- **${test.name}**: ${test.avg}ms average response time\n`;
      });
      summary += `\n`;
    }

    const failingTests = this.results.tests.filter(test => test.successRate < 95);
    if (failingTests.length > 0) {
      summary += `### ❌ Low Success Rate (<95%)\n`;
      failingTests.forEach(test => {
        summary += `- **${test.name}**: ${test.successRate.toFixed(1)}% success rate\n`;
      });
      summary += `\n`;
    }

    if (slowTests.length === 0 && failingTests.length === 0) {
      summary += `### ✅ All Tests Passed Performance Thresholds\n`;
      summary += `All operations completed within acceptable response times and success rates.\n\n`;
    }

    return summary;
  }

  printSummary() {
    console.log('\n📈 Performance Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    this.results.tests.forEach(test => {
      const status = test.successRate >= 95 && test.avg < 500 ? '✅' : '⚠️';
      console.log(`${status} ${test.name.padEnd(30)} | ${test.avg.toString().padStart(6)}ms | ${test.successRate.toFixed(1).padStart(5)}%`);
    });
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }
}

// Run benchmarks if this file is executed directly
if (require.main === module) {
  const benchmark = new PerformanceBenchmark();
  benchmark.runBenchmarks().catch(console.error);
}

module.exports = PerformanceBenchmark;