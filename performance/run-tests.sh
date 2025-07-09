#!/bin/bash

# Performance Testing Script
# Automated performance testing suite for Mall Admin System

set -e

echo "🚀 Mall Admin System - Performance Testing Suite"
echo "=================================================="

# Configuration
API_URL=${API_URL:-"http://localhost:3001"}
REPORTS_DIR="./reports"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Create reports directory
mkdir -p $REPORTS_DIR

# Function to check if server is running
check_server() {
    echo -e "${BLUE}🔍 Checking server status...${NC}"
    
    if curl -s -f "$API_URL/api/v1/health" > /dev/null; then
        echo -e "${GREEN}✅ Server is running at $API_URL${NC}"
        return 0
    else
        echo -e "${RED}❌ Server is not running at $API_URL${NC}"
        echo "Please start the server before running performance tests."
        return 1
    fi
}

# Function to install dependencies
install_dependencies() {
    echo -e "${BLUE}📦 Installing dependencies...${NC}"
    
    if [ ! -f "package.json" ]; then
        echo -e "${RED}❌ package.json not found${NC}"
        return 1
    fi
    
    npm install
    echo -e "${GREEN}✅ Dependencies installed${NC}"
}

# Function to run load tests
run_load_tests() {
    echo -e "${BLUE}🔄 Running load tests...${NC}"
    
    # Run load test with Artillery
    artillery run load-test.js \
        --output "$REPORTS_DIR/load-test-$TIMESTAMP.json" \
        --config "{ \"target\": \"$API_URL\" }"
    
    # Generate HTML report
    if [ -f "$REPORTS_DIR/load-test-$TIMESTAMP.json" ]; then
        artillery report "$REPORTS_DIR/load-test-$TIMESTAMP.json" \
            --output "$REPORTS_DIR/load-test-$TIMESTAMP.html"
        echo -e "${GREEN}✅ Load test completed${NC}"
        echo -e "${BLUE}📊 Report: $REPORTS_DIR/load-test-$TIMESTAMP.html${NC}"
    else
        echo -e "${RED}❌ Load test failed${NC}"
        return 1
    fi
}

# Function to run stress tests
run_stress_tests() {
    echo -e "${BLUE}💪 Running stress tests...${NC}"
    
    # Run stress test with Artillery
    artillery run stress-test.js \
        --output "$REPORTS_DIR/stress-test-$TIMESTAMP.json" \
        --config "{ \"target\": \"$API_URL\" }"
    
    # Generate HTML report
    if [ -f "$REPORTS_DIR/stress-test-$TIMESTAMP.json" ]; then
        artillery report "$REPORTS_DIR/stress-test-$TIMESTAMP.json" \
            --output "$REPORTS_DIR/stress-test-$TIMESTAMP.html"
        echo -e "${GREEN}✅ Stress test completed${NC}"
        echo -e "${BLUE}📊 Report: $REPORTS_DIR/stress-test-$TIMESTAMP.html${NC}"
    else
        echo -e "${RED}❌ Stress test failed${NC}"
        return 1
    fi
}

# Function to run benchmark tests
run_benchmark_tests() {
    echo -e "${BLUE}📊 Running benchmark tests...${NC}"
    
    # Set API URL for benchmark
    export API_URL="$API_URL"
    
    # Run benchmark
    node benchmark.js
    
    echo -e "${GREEN}✅ Benchmark tests completed${NC}"
    echo -e "${BLUE}📁 Check reports/ directory for detailed results${NC}"
}

# Function to run YAML configuration tests
run_yaml_tests() {
    echo -e "${BLUE}⚙️ Running YAML configuration tests...${NC}"
    
    # Update YAML config with current API URL
    sed -i.bak "s|target: .*|target: '$API_URL'|g" performance-test.yml
    
    # Run YAML test
    artillery run performance-test.yml \
        --output "$REPORTS_DIR/yaml-test-$TIMESTAMP.json"
    
    # Generate HTML report
    if [ -f "$REPORTS_DIR/yaml-test-$TIMESTAMP.json" ]; then
        artillery report "$REPORTS_DIR/yaml-test-$TIMESTAMP.json" \
            --output "$REPORTS_DIR/yaml-test-$TIMESTAMP.html"
        echo -e "${GREEN}✅ YAML test completed${NC}"
        echo -e "${BLUE}📊 Report: $REPORTS_DIR/yaml-test-$TIMESTAMP.html${NC}"
    else
        echo -e "${RED}❌ YAML test failed${NC}"
        return 1
    fi
    
    # Restore original YAML
    mv performance-test.yml.bak performance-test.yml
}

# Function to run quick health check
run_health_check() {
    echo -e "${BLUE}🏥 Running health check...${NC}"
    
    artillery quick --count 10 --num 5 "$API_URL/api/v1/health"
    
    echo -e "${GREEN}✅ Health check completed${NC}"
}

# Function to generate summary report
generate_summary() {
    echo -e "${BLUE}📋 Generating summary report...${NC}"
    
    SUMMARY_FILE="$REPORTS_DIR/summary-$TIMESTAMP.md"
    
    cat > "$SUMMARY_FILE" << EOF
# Performance Test Summary

**Test Run:** $TIMESTAMP
**API URL:** $API_URL
**Environment:** $(node -e "console.log(process.env.NODE_ENV || 'development')")

## Test Results

### Load Test
- **File:** load-test-$TIMESTAMP.html
- **Purpose:** Measure system performance under normal load
- **Duration:** ~10 minutes

### Stress Test
- **File:** stress-test-$TIMESTAMP.html
- **Purpose:** Find system breaking points under high load
- **Duration:** ~16 minutes

### Benchmark Test
- **Files:** benchmark-*.json, summary-*.md
- **Purpose:** Measure individual operation performance
- **Duration:** ~5 minutes

### YAML Configuration Test
- **File:** yaml-test-$TIMESTAMP.html
- **Purpose:** Test with specific performance thresholds
- **Duration:** ~10 minutes

## Performance Metrics

Check individual reports for detailed metrics including:
- Response times (avg, min, max, p95, p99)
- Request rates
- Error rates
- System resource usage

## Recommendations

1. Review response times > 2000ms
2. Investigate error rates > 5%
3. Monitor memory usage during load
4. Check database query performance
5. Optimize slow endpoints

## Next Steps

- [ ] Review detailed reports
- [ ] Identify performance bottlenecks
- [ ] Implement optimizations
- [ ] Re-run tests to verify improvements
- [ ] Set up continuous performance monitoring

---
Generated by Mall Admin System Performance Testing Suite
EOF

    echo -e "${GREEN}✅ Summary report generated: $SUMMARY_FILE${NC}"
}

# Function to clean old reports
clean_reports() {
    echo -e "${BLUE}🧹 Cleaning old reports...${NC}"
    
    # Keep only last 10 reports
    cd "$REPORTS_DIR"
    ls -t *.json 2>/dev/null | tail -n +11 | xargs -r rm
    ls -t *.html 2>/dev/null | tail -n +11 | xargs -r rm
    ls -t *.md 2>/dev/null | tail -n +11 | xargs -r rm
    cd ..
    
    echo -e "${GREEN}✅ Old reports cleaned${NC}"
}

# Main execution
main() {
    echo -e "${BLUE}Starting performance tests at $(date)${NC}"
    
    # Check if server is running
    if ! check_server; then
        exit 1
    fi
    
    # Install dependencies
    install_dependencies
    
    # Clean old reports
    clean_reports
    
    # Run tests based on arguments
    case "${1:-all}" in
        "load")
            run_load_tests
            ;;
        "stress")
            run_stress_tests
            ;;
        "benchmark")
            run_benchmark_tests
            ;;
        "yaml")
            run_yaml_tests
            ;;
        "health")
            run_health_check
            ;;
        "quick")
            run_health_check
            run_benchmark_tests
            ;;
        "all")
            run_health_check
            run_load_tests
            run_stress_tests
            run_benchmark_tests
            run_yaml_tests
            generate_summary
            ;;
        *)
            echo "Usage: $0 [load|stress|benchmark|yaml|health|quick|all]"
            echo "  load      - Run load tests only"
            echo "  stress    - Run stress tests only"
            echo "  benchmark - Run benchmark tests only"
            echo "  yaml      - Run YAML configuration tests only"
            echo "  health    - Run health check only"
            echo "  quick     - Run health check and benchmark only"
            echo "  all       - Run all tests (default)"
            exit 1
            ;;
    esac
    
    echo -e "${GREEN}🎉 Performance testing completed!${NC}"
    echo -e "${BLUE}📁 Check the reports/ directory for detailed results${NC}"
}

# Run main function with all arguments
main "$@"