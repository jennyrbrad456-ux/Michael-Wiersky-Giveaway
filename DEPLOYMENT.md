# Deployment Guide

## Pre-Deployment Checklist

### Code Quality
- [ ] All tests pass: `npm test`
- [ ] No lint errors: `npm run lint`
- [ ] TypeScript types are valid: `npm run type-check`
- [ ] Code is formatted: `npm run format`
- [ ] Build succeeds: `npm run build`

### CI/CD Pipeline
- [ ] GitHub Actions workflow passes all checks
- [ ] Build succeeds for Node.js 18.x and 20.x
- [ ] Security audit passes (npm audit)
- [ ] Code coverage meets threshold
- [ ] Build artifact generated successfully

### Documentation
- [ ] README.md is up to date
- [ ] Environment variables are documented in `.env.example`
- [ ] Change log is updated
- [ ] Deployment instructions are clear

## Deployment Steps

### 1. Prepare Release
```bash
# Ensure you're on main branch
git checkout main
git pull origin main

# Run full test suite
npm test

# Build the project
npm run build

# Verify build artifacts
ls -la dist/
```

### 2. Create Release Tag
```bash
# Create and push a version tag
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

### 3. Deploy via Docker

#### Build and Test Locally
```bash
# Build Docker image with version tag
docker build -t michael-wiersky-giveaway:v1.0.0 .
docker tag michael-wiersky-giveaway:v1.0.0 michael-wiersky-giveaway:latest

# Test the container
docker run -p 3000:3000 michael-wiersky-giveaway:latest

# Verify health
curl http://localhost:3000
```

#### Push to Registry
```bash
# Tag for registry (if applicable)
docker tag michael-wiersky-giveaway:v1.0.0 your-registry/michael-wiersky-giveaway:v1.0.0

# Push to registry
docker push your-registry/michael-wiersky-giveaway:v1.0.0
```

### 4. Deploy to Production Platform

#### Option A: Vercel (Recommended for React)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Option B: Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### Option C: Traditional Server/Docker
```bash
# SSH into server
ssh user@your-server.com

# Pull latest changes
cd /app/michael-wiersky-giveaway
git pull origin main

# Deploy with Docker
docker-compose up -d --build
```

### 5. Monitor Deployment
- Watch GitHub Actions workflow execution
- Verify application loads correctly
- Check browser console for errors
- Monitor performance metrics
- Verify all features work as expected

## Post-Deployment Verification

1. **Application Load**
   ```bash
   curl https://your-domain.com
   # Should load the React application
   ```

2. **Performance Check**
   - Page load time < 3 seconds
   - Lighthouse score > 80
   - No console errors in production

3. **Functionality Test**
   - Test all main features
   - Verify links and navigation
   - Check responsive design
   - Test on mobile devices

4. **Monitoring Setup**
   - Set up error tracking (Sentry, etc.)
   - Configure performance monitoring
   - Set up uptime monitoring
   - Configure log aggregation

## Environment-Specific Deployment

### Development
```bash
NODE_ENV=development
VITE_API_URL=http://localhost:3000
```

### Staging
```bash
NODE_ENV=production
VITE_API_URL=https://api-staging.your-domain.com
```

### Production
```bash
NODE_ENV=production
VITE_API_URL=https://api.your-domain.com
```

## Continuous Deployment

The repository is configured with GitHub Actions for continuous deployment:

1. **On Push to Main**: Automatically builds and tests
2. **On Pull Request**: Runs full CI pipeline for review
3. **On Release Tag**: Triggers production deployment

### Manual Deployment Trigger
```bash
# Trigger workflow manually (if configured)
gh workflow run ci.yml
```

## Rollback Procedure

If issues occur after deployment:

```bash
# Revert to previous version
git revert <commit-hash>
git push origin main

# Create rollback tag
git tag -a v1.0.1-rollback -m "Rollback to stable version"
git push origin v1.0.1-rollback

# Redeploy previous version
npm run build
# Deploy new version
```

## Troubleshooting

### Build Failures
- Check Node.js version compatibility: `node --version`
- Verify dependencies: `npm ci`
- Review TypeScript errors: `npm run type-check`
- Check for missing environment variables

### Test Failures
- Run tests locally: `npm test`
- Review test output for specifics
- Check coverage: `npm test -- --coverage`
- Verify test environment setup

### Runtime Errors
- Check browser console for errors
- Review network requests in DevTools
- Verify API endpoints are accessible
- Check environment variables are loaded

### Performance Issues
- Analyze bundle size: `npm run build`
- Use Chrome DevTools to profile
- Check network tab for slow requests
- Review React performance (React DevTools)

## Monitoring and Alerting

Set up monitoring for:
- Page load times and Core Web Vitals
- JavaScript errors
- Failed API requests
- Application uptime
- Deployment health

### Recommended Tools
- **Error Tracking**: Sentry, LogRocket
- **Performance**: DataDog, New Relic, Vercel Analytics
- **Uptime**: UptimeRobot, StatusCake
- **Logging**: ELK Stack, LogRocket, Datadog

## Database and API Considerations

If your application connects to external services:

1. **API Endpoints**
   - Verify API is accessible from production
   - Test authentication/authorization
   - Check rate limiting

2. **Database**
   - Verify database backups are configured
   - Test connection from production environment
   - Monitor database performance

3. **Secrets Management**
   - Use GitHub Secrets for sensitive data
   - Rotate API keys regularly
   - Never commit secrets to repository

## Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Deployment](https://vercel.com/docs)
- [Netlify Deployment](https://docs.netlify.com/)

## Support

For deployment issues, consult:
1. GitHub Actions logs
2. Application error logs
3. This deployment guide
4. Create a GitHub issue for help
