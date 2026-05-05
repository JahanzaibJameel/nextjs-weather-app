# Deployment Guide

This guide covers deploying the Enterprise Weather App to production environments.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Add your API keys
# Get OpenWeatherMap API key from https://openweathermap.org/api
# Get Sentry DSN from https://sentry.io
```

### 3. Local Development
```bash
npm run dev
```

## 🏗️ Production Deployment

### Vercel (Recommended)

#### Automatic Deployment
1. Connect repository to [Vercel](https://vercel.com)
2. Add environment variables:
   - `WEATHER_API_KEY` - OpenWeatherMap API key
   - `NEXT_PUBLIC_SENTRY_DSN` - Sentry DSN
   - `SENTRY_AUTH_TOKEN` - Sentry auth token
3. Deploy automatically on push to main branch

#### Manual Deployment
```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

### Docker Deployment

#### Build Image
```bash
# Build Docker image
docker build -t weather-app .

# Run container
docker run -p 3000:3000 \
  -e WEATHER_API_KEY=your_api_key \
  -e NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn \
  weather-app
```

#### Docker Compose
```yaml
version: '3.8'
services:
  weather-app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - WEATHER_API_KEY=${WEATHER_API_KEY}
      - NEXT_PUBLIC_SENTRY_DSN=${SENTRY_DSN}
      - NODE_ENV=production
    restart: unless-stopped
```

### Traditional Hosting

#### Build and Deploy
```bash
# Install dependencies
npm ci --production

# Build application
npm run build

# Start production server
npm start
```

## 🔧 Environment Variables

### Required Variables
| Variable | Description | Where to Set |
|----------|-------------|---------------|
| `WEATHER_API_KEY` | OpenWeatherMap API key | Hosting platform / .env.local |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry error tracking DSN | Hosting platform / .env.local |

### Optional Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `RATE_LIMIT_MAX_REQUESTS` | API rate limit per window | 100 |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in milliseconds | 900000 (15 min) |
| `NODE_ENV` | Environment mode | development |

## 🔒 Security Configuration

### Production Security Headers
The application includes comprehensive security headers:
- Content Security Policy (CSP)
- XSS Protection
- Frame Protection (X-Frame-Options)
- MIME Type Sniffing Protection
- Strict Transport Security (HTTPS only)
- Referrer Policy

### API Security
- Rate limiting (100 requests/15min per IP)
- Input validation with Zod schemas
- CORS configuration
- Request/response logging

## 📊 Monitoring & Observability

### Sentry Integration
```typescript
// Automatic error tracking
import { captureException } from '@/utils/sentry';

try {
  // Your code
} catch (error) {
  captureException(error, { context: 'additional_info' });
}
```

### Structured Logging
```typescript
import { logger } from '@/utils/logger';

// API request logging
logger.apiRequest('GET', '/api/weather', { query: 'London' });

// Performance logging
logger.performance('api_response_time', 150, 'ms');

// User action logging
logger.userAction('search_weather', { query: 'London' });
```

## 🧪 Testing in Production

### Health Checks
```bash
# API health check
curl https://your-domain.com/api/weather?q=London

# Application health check
curl https://your-domain.com/
```

### Load Testing
```bash
# Using k6
k6 run --vus 10 --duration 30s load-test.js

# Load test script example
import http from 'k6/http';

export default function () {
  http.get('https://your-domain.com/api/weather?q=London');
}
```

## 🔧 Performance Optimization

### Bundle Analysis
```bash
# Analyze bundle size
npm run analyze

# Check bundle size impact
npm run build
ls -la .next/static/chunks/
```

### Image Optimization
- WebP/AVIF format support
- Lazy loading enabled
- Responsive images
- CDN delivery

### Caching Strategy
- API responses: 5-10 minutes
- Static assets: 1 year (with versioning)
- Browser caching headers configured

## 📱 PWA Features

### Service Worker
The app includes PWA capabilities:
- Offline functionality
- App shell caching
- Background sync
- Push notifications ready

### PWA Testing
```bash
# Test PWA with Lighthouse
npx lighthouse https://your-domain.com --view

# Check PWA manifest
curl https://your-domain.com/manifest.json
```

## 🔄 CI/CD Pipeline

### GitHub Actions
The pipeline includes:
- ✅ Code quality checks (ESLint, Prettier)
- ✅ Type checking (TypeScript)
- ✅ Unit tests (Jest)
- ✅ E2E tests (Playwright)
- ✅ Security scanning (Snyk, npm audit)
- ✅ Build verification
- ✅ Deployment to staging/production
- ✅ Performance testing (Lighthouse CI)

### Pipeline Triggers
- **Main branch** → Production deployment
- **Develop branch** → Staging deployment
- **Pull requests** → Full test suite

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache
rm -rf .next node_modules
npm install

# Check Node.js version
node --version # Should be 18+
```

#### API Errors
```bash
# Check API key validity
curl "https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_KEY"

# Check rate limits
curl -I https://your-domain.com/api/weather?q=London
```

#### Performance Issues
```bash
# Check Core Web Vitals
npx lighthouse https://your-domain.com --output=json

# Monitor bundle size
npm run analyze
```

### Debug Mode
```bash
# Enable debug logging
DEBUG=true npm run dev

# Check Sentry issues
# Visit your Sentry dashboard
```

## 📈 Scaling Considerations

### Database Scaling
- Consider Redis for rate limiting in production
- Implement user accounts with PostgreSQL/MongoDB
- Add caching layer (Redis/Memcached)

### API Scaling
- Use CDN for static assets
- Implement API gateway
- Consider serverless functions for scaling

### Monitoring Scaling
- Set up uptime monitoring
- Implement alerting
- Use APM tools (DataDog, New Relic)

## 🌐 Domain Configuration

### DNS Records
```
A     your-domain.com    -> server-ip
CNAME www           -> your-domain.com
TXT   verification     -> domain-verification-code
```

### SSL/TLS
- Automatic SSL with Vercel
- Let's Encrypt for self-hosted
- HSTS headers configured

## 📞 Support

### Monitoring Dashboards
- Sentry: Error tracking and performance
- Vercel Analytics: Usage and performance
- Custom logging: Structured logs

### Emergency Procedures
1. Check deployment status
2. Review error logs in Sentry
3. Verify API key validity
4. Check rate limiting status
5. Monitor system resources

### Rollback Procedures
```bash
# Vercel rollback
vercel rollback [deployment-url]

# Manual rollback
git checkout previous-stable-commit
npm run build
npm start
```

---

## 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] SSL certificate installed
- [ ] DNS records configured
- [ ] Security headers verified
- [ ] API rate limiting tested
- [ ] Error monitoring active
- [ ] Performance monitoring setup
- [ ] Backup procedures documented
- [ ] Rollback procedures tested
- [ ] Load testing completed
- [ ] Security audit performed
- [ ] PWA functionality verified
- [ ] Accessibility testing completed
- [ ] Cross-browser testing done

Your Enterprise Weather App is now production-ready! 🚀
