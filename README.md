# Enterprise Weather App

A production-ready, enterprise-grade weather application built with Next.js, TypeScript, and modern web development best practices.

## 🚀 Features

### Core Functionality
- **Real-time Weather Data**: Fetch current weather information for any city worldwide
- **Geolocation Support**: Automatically detects user location on app load
- **Dynamic Backgrounds**: Weather-appropriate background images based on conditions and temperature
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Enterprise Features
- **TypeScript**: Full type safety and improved developer experience
- **React Query**: Advanced data fetching with caching, retries, and background updates
- **Secure API**: Server-side API routes with rate limiting and input validation
- **Error Handling**: Comprehensive error boundaries and user-friendly error messages
- **Accessibility**: WCAG compliant with ARIA labels and keyboard navigation
- **Performance**: Optimized bundle size, image optimization, and lazy loading
- **Testing**: Unit tests, integration tests, and E2E tests with high coverage
- **Security**: Content Security Policy, XSS protection, and secure headers

### Developer Experience
- **ESLint & Prettier**: Consistent code formatting and linting
- **Husky**: Pre-commit hooks for code quality
- **Bundle Analysis**: Built-in bundle analyzer for optimization
- **Hot Reload**: Fast development with Turbopack

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: CSS with modern features (Grid, Flexbox, CSS Variables)
- **State Management**: React Query (@tanstack/react-query)
- **UI Components**: Custom components with accessibility
- **Testing**: Jest + React Testing Library + Playwright
- **API**: OpenWeatherMap API
- **Deployment**: Vercel-ready

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nextjs-weather-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Add your OpenWeatherMap API key to `.env`:
   ```
   WEATHER_API_KEY=your_openweathermap_api_key_here
   NODE_OPTIONS=--openssl-legacy-provider
   RATE_LIMIT_MAX_REQUESTS=100
   RATE_LIMIT_WINDOW_MS=900000
   ```
   
   Get your free API key from [OpenWeatherMap](https://openweathermap.org/api).

4. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Testing

### Unit & Component Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### End-to-End Tests
```bash
# Run E2E tests
npm run test:e2e
```

### Code Quality
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npm run type-check

# Format code
npm run format
```

## 📊 Scripts

| Script | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run type-check` | Run TypeScript type checking |
| `npm run format` | Format code with Prettier |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate coverage report |
| `npm run test:e2e` | Run E2E tests |
| `npm run analyze` | Analyze bundle size |
| `npm run prepare` | Setup Husky hooks |

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── SearchBar.tsx   # Weather search component
│   └── WeatherDisplay.tsx # Weather data display
├── hooks/              # Custom React hooks
│   └── useDebounce.ts  # Debounce hook
├── pages/              # Next.js pages
│   ├── api/            # API routes
│   │   └── weather.ts  # Weather API endpoint
│   ├── _app.tsx        # App component with providers
│   ├── _document.tsx    # Document component
│   └── index.tsx       # Home page
├── styles/             # Global styles
│   └── globals.css      # Main stylesheet
└── types/              # TypeScript type definitions
    └── weather.ts      # Weather data types

tests/
├── components/         # Component tests
├── e2e/              # E2E tests
└── utils/             # Utility tests
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `WEATHER_API_KEY` | OpenWeatherMap API key | Yes |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | No |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in ms | No |

### API Rate Limiting

The API includes built-in rate limiting to prevent abuse:
- Default: 100 requests per 15 minutes per IP
- Configurable via environment variables
- In-memory storage (use Redis for production)

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Add `WEATHER_API_KEY` to environment variables
3. Deploy automatically on push to main branch

### Docker
```bash
# Build image
docker build -t weather-app .

# Run container
docker run -p 3000:3000 weather-app
```

### Manual Deployment
```bash
npm run build
npm run start
```

## 🔒 Security Features

- **Content Security Policy**: Prevents XSS attacks
- **Rate Limiting**: Protects against API abuse
- **Input Validation**: Zod schema validation
- **Secure Headers**: X-Frame-Options, X-Content-Type-Options, etc.
- **Environment Variables**: Sensitive data never exposed to client

## 📈 Performance

- **Bundle Optimization**: Tree shaking and code splitting
- **Image Optimization**: Next.js Image component with WebP/AVIF
- **Caching**: React Query caching with stale-while-revalidate
- **Minification**: SWC minification for faster builds
- **CDN Ready**: Optimized for content delivery networks

## ♿ Accessibility

- **WCAG 2.1 AA**: Compliant with accessibility standards
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Proper ARIA labels and roles
- **Focus Management**: Visible focus indicators
- **High Contrast**: Support for high contrast mode

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Ensure accessibility compliance
- Follow ESLint and Prettier rules
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for weather data API
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS
- [React Query](https://tanstack.com/query) for data fetching

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the [documentation](https://nextjs.org/docs)
- Review [OpenWeatherMap API docs](https://openweathermap.org/api)
