# Michael Wiersky Giveaway Foundation

A modern React + TypeScript giveaway foundation platform with production-ready CI/CD pipeline.

## Features

- ✅ React 19 with TypeScript strict mode
- ✅ Vite for fast development and optimized builds
- ✅ Automated testing with Vitest
- ✅ Code linting with ESLint
- ✅ Code formatting with Prettier
- ✅ GitHub Actions CI/CD pipeline
- ✅ Docker containerization
- ✅ Test coverage reporting
- ✅ Production-ready configuration

## Quick Start

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/jennyrbrad456-ux/Michael-Wiersky-Giveaway.git
cd Michael-Wiersky-Giveaway

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

### Building

```bash
# Build the project
npm run build

# Preview production build locally
npm run preview
```

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests with UI
npm run test:ui
```

## Docker

```bash
# Build Docker image
docker build -t michael-wiersky-giveaway:latest .

# Run container
docker run -p 3000:3000 michael-wiersky-giveaway:latest

# Check health
curl http://localhost:3000
```

## CI/CD Pipeline

The project includes an automated GitHub Actions workflow that:

1. **Runs on**: Push to `main`/`develop`, and all pull requests
2. **Tests**: TypeScript, ESLint, Vitest, coverage reports
3. **Builds**: Compiles React/TypeScript and verifies the build
4. **Deploys**: Automatically notifies when ready for production deployment

### Pipeline Stages

- **Setup & Test**: Node.js 18.x and 20.x compatibility testing
- **Security**: npm audit for dependency vulnerabilities
- **Build Artifact**: Creates distributable build
- **Deploy Notification**: Production deployment readiness

## Project Structure

```
├── src/
│   ├── App.tsx              # Main application component
│   ├── App.css              # Component styles
│   ├── index.css            # Global styles
│   └── main.tsx             # Application entry point
├── public/                  # Static assets
├── dist/                    # Built output (generated)
├── .github/workflows/       # GitHub Actions workflows
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite configuration
├── vitest.config.ts         # Vitest configuration
├── tsconfig.json            # TypeScript configuration
├── .eslintrc.json           # ESLint configuration
├── .prettierrc.json         # Prettier configuration
├── Dockerfile               # Docker configuration
├── index.html               # HTML entry point
└── README.md                # This file
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:ui` | Run tests with UI dashboard |
| `npm run lint` | Lint TypeScript/React files |
| `npm run lint:fix` | Lint and automatically fix issues |
| `npm run type-check` | Check TypeScript types without building |
| `npm run format` | Format code with Prettier |

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
NODE_ENV=development
VITE_API_URL=http://localhost:3000
```

## Deployment Readiness Checklist

- ✅ TypeScript strict mode enabled
- ✅ Automated testing configured (Vitest)
- ✅ React hooks linting enabled
- ✅ Linting and code formatting
- ✅ GitHub Actions CI/CD pipeline
- ✅ Docker containerization
- ✅ Health check endpoints
- ✅ Environment configuration
- ✅ Code coverage tracking
- ✅ Dependency auditing

## Contributing

1. Create a feature branch
2. Make your changes
3. Ensure all tests pass: `npm test`
4. Lint your code: `npm run lint:fix`
5. Commit with clear messages
6. Push and create a pull request

## Build Process

### Development Build
```bash
npm run dev
# Starts Vite dev server with hot module replacement
```

### Production Build
```bash
npm run build
# Optimized build with code splitting and minification
# Output: dist/ directory
```

### Size Analysis
```bash
# Check bundle size
npm run build
ls -lh dist/
```

## Performance Optimization

- Code splitting via Vite
- Tree-shaking of unused code
- Minification and compression
- Asset optimization
- Lazy loading support

## Troubleshooting

### Build Issues
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version`
- Review build errors in console

### Test Failures
- Run tests locally: `npm test`
- Check coverage: `npm test -- --coverage`
- Review test output in detail

### Development Issues
- Clear Vite cache: `rm -rf node_modules/.vite`
- Restart dev server: `npm run dev`

## Support

For issues and questions, please open a GitHub issue.

## License

MIT

---

**Last Updated**: August 21, 2024
