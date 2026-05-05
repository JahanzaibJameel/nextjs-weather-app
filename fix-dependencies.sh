#!/usr/bin/env bash
set -e

echo "🔧 Fixing Dependency Conflicts and Installation Issues"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "${BLUE}Step 1: Clean up existing installation...${NC}"
echo "${YELLOW}Removing node_modules and package-lock.json...${NC}"
if [ -d "node_modules" ]; then
    rm -rf node_modules
fi
if [ -f "package-lock.json" ]; then
    rm -f package-lock.json
fi

echo ""
echo "${BLUE}Step 2: Install fixed dependencies...${NC}"
echo "${YELLOW}Installing with npm ci (clean install)...${NC}"
npm ci

echo ""
echo "${BLUE}Step 3: Verify critical dependencies...${NC}"
echo "${YELLOW}Checking Sentry (v8) compatibility...${NC}"
if npm list @sentry/nextjs | grep -q "@sentry/nextjs@8"; then
    echo "${GREEN}✅ Sentry v8 installed correctly${NC}"
else
    echo "${RED}❌ Sentry version issue detected${NC}"
    exit 1
fi

echo ""
echo "${BLUE}Step 4: Security audit and fixes...${NC}"
echo "${YELLOW}Running npm audit fix...${NC}"
npm audit fix

echo ""
echo "${BLUE}Step 5: Build verification...${NC}"
echo "${YELLOW}Testing TypeScript compilation...${NC}"
if npm run type-check; then
    echo "${GREEN}✅ TypeScript compilation successful${NC}"
else
    echo "${RED}❌ TypeScript compilation failed${NC}"
    exit 1
fi

echo ""
echo "${YELLOW}Testing build process...${NC}"
if npm run build; then
    echo "${GREEN}✅ Build successful${NC}"
else
    echo "${RED}❌ Build failed${NC}"
    exit 1
fi

echo ""
echo "${BLUE}Step 6: Test verification...${NC}"
echo "${YELLOW}Running unit tests...${NC}"
if npm test; then
    echo "${GREEN}✅ Unit tests passing${NC}"
else
    echo "${RED}❌ Unit tests failed${NC}"
    exit 1
fi

echo ""
echo "${BLUE}Step 7: Bundle analysis...${NC}"
echo "${YELLOW}Analyzing bundle size...${NC}"
ANALYZE=true npm run build > /dev/null 2>&1
echo "${GREEN}✅ Bundle analysis completed${NC}"

echo ""
echo "=============================================="
echo "${GREEN}🎉 ALL DEPENDENCY ISSUES RESOLVED!${NC}"
echo ""
echo "${BLUE}Your project is now ready for:${NC}"
echo "- ✅ Clean dependency tree"
echo "- ✅ Security vulnerabilities fixed" 
echo "- ✅ TypeScript compilation"
echo "- ✅ Successful build"
echo "- ✅ Test suite passing"
echo "- ✅ Bundle analysis complete"
echo ""
echo "${GREEN}🚀 Ready for production deployment!${NC}"
echo ""
echo "${BLUE}Next steps:${NC}"
echo "1. Run: ./verify-production.sh"
echo "2. Push to main branch for deployment"
echo "3. Monitor /api/health endpoint"
echo "4. Check Sentry for error tracking"
