#!/bin/bash

# Local CI Test Script
# This script mimics the GitHub Actions workflow for local testing

set -e  # Exit on error

echo "🚀 Starting Local CI Test Pipeline..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Test Frontend
print_step "Testing Frontend..."

print_step "Installing frontend dependencies..."
npm install

print_step "Running frontend linting (if available)..."
npm run lint --if-present || print_warning "No linting script found"

print_step "Running frontend tests..."
npm run test:run

print_step "Building frontend..."
npm run build

print_success "Frontend tests completed!"

# Test Backend
print_step "Testing Backend..."

cd server

print_step "Installing backend dependencies..."
npm install

print_step "Running TypeScript compilation..."
npm run build

print_step "Running backend tests with coverage..."
npm test

print_success "Backend tests completed!"

cd ..

# Security Audit
print_step "Running Security Audits..."

print_step "Auditing frontend dependencies..."
npm audit --audit-level moderate || print_warning "Frontend audit found issues"

print_step "Auditing backend dependencies..."
cd server
npm audit --audit-level moderate || print_warning "Backend audit found issues"
cd ..

# Final Success
echo ""
echo "🎉 Local CI Pipeline Completed Successfully!"
echo -e "${GREEN}✅ All tests passed! Your code is ready for deployment 🚀${NC}"
echo ""
echo "📊 Summary:"
echo "  - Frontend tests: ✅ Passed"
echo "  - Backend tests: ✅ Passed" 
echo "  - TypeScript compilation: ✅ Passed"
echo "  - Security audits: ✅ Completed"
echo "  - Builds: ✅ Successful"
echo ""
echo "🔗 Next steps:"
echo "  1. Commit your changes: git add . && git commit -m 'feat: add CI pipeline'"
echo "  2. Push to main branch: git push origin main"
echo "  3. Watch the GitHub Actions run at: https://github.com/your-username/react-contact-management-app/actions" 