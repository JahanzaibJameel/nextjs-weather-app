const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
  // Exclude E2E tests from Jest
  testMatch: [
    '<rootDir>/tests/components/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/tests/utils/**/*.{js,jsx,ts,tsx}',
  ],
  testPathIgnorePatterns: [
    '/tests/e2e/',
  ],
  transformIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/tests/e2e/',
  ],
});

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig;
