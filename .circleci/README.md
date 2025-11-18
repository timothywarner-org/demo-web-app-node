# CircleCI Configuration for Globomantics Robotics API

## Overview

This directory contains CircleCI configuration for automated testing, building, and deployment of the Globomantics Robotics API.

## Configuration File

- **config.yml**: Main CircleCI pipeline configuration

## Features

### 1. Multi-Node Version Testing

Tests are run on multiple Node.js versions to ensure compatibility:
- Node.js 18 (LTS)
- Node.js 20 (LTS)
- Node.js 21 (Current)

### 2. Parallel Job Execution

Jobs run in parallel where possible to minimize build time:
- Linting
- Security audits
- Tests on different Node versions
- Build verification

### 3. Comprehensive Testing

- **Unit Tests**: Model and utility function tests
- **Integration Tests**: Full API endpoint tests
- **Coverage Reports**: Code coverage with 70% minimum threshold
- **JUnit Reports**: Test results in JUnit XML format

### 4. Security

- **npm audit**: Automated dependency vulnerability scanning
- **Scheduled scans**: Weekly security audits

### 5. Caching

- **Dependency caching**: npm packages cached for faster builds
- **Cache key**: Based on `package-lock.json` checksum

### 6. Artifacts

Stored artifacts include:
- Test results (JUnit XML)
- Coverage reports (HTML and JSON)
- Server startup logs

## Workflows

### 1. Main Workflow: `build-test-deploy`

Runs on every push and pull request.

**Pipeline Stages:**

```
Setup
  ↓
├── Lint
├── Security Audit
├── Test (Node 18)
├── Test (Node 20)
└── Test (Node 21)
  ↓
├── Integration Tests
├── Build Verification
└── Coverage Report
  ↓
Deploy to Staging (main branch only)
```

**Jobs:**

- **setup**: Checkout code, install dependencies, cache
- **lint**: Run ESLint code quality checks
- **security-audit**: Check for vulnerable dependencies
- **test-node-X**: Run tests on specific Node version
- **integration-tests**: Run API integration tests
- **build-verification**: Verify server starts correctly
- **coverage-report**: Generate and store coverage reports
- **deploy-staging**: Deploy to staging environment (main branch only)

### 2. Nightly Workflow

Runs daily at midnight (UTC).

**Purpose:**
- Catch issues from upstream dependencies
- Regular comprehensive testing
- Coverage tracking over time

### 3. Weekly Security Workflow

Runs every Sunday at midnight (UTC).

**Purpose:**
- Regular security audits
- Dependency vulnerability checks
- Compliance verification

## Setup Instructions

### 1. Connect Repository to CircleCI

1. Go to [CircleCI](https://circleci.com/)
2. Sign in with your GitHub account
3. Click "Projects" in the left sidebar
4. Find your repository and click "Set Up Project"
5. CircleCI will automatically detect `.circleci/config.yml`
6. Click "Start Building"

### 2. Environment Variables

No environment variables are required for basic operation. For deployment, you may need:

```bash
# Add in CircleCI Project Settings > Environment Variables

# For Heroku deployment
HEROKU_API_KEY=your_heroku_api_key
HEROKU_APP_NAME=your_app_name

# For AWS deployment
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
```

### 3. Configure Contexts (Optional)

For shared secrets across projects:

1. Go to Organization Settings > Contexts
2. Create context (e.g., "production-deploy")
3. Add environment variables to context
4. Reference in config.yml:

```yaml
- deploy-staging:
    context: production-deploy
```

## Configuration Details

### Executors

```yaml
node-executor:
  parameters:
    node-version: "18"  # Parameterized Node version
  docker:
    - image: cimg/node:<< parameters.node-version >>
```

Benefits:
- Consistent environment across jobs
- Easy to change Node version
- Optimized Docker images from CircleCI

### Commands

Reusable command snippets:

1. **restore-dependencies**: Restore from cache
2. **install-dependencies**: Run `npm ci`
3. **save-dependencies**: Save to cache
4. **run-tests**: Execute test suite
5. **store-test-results**: Upload test artifacts

### Caching Strategy

```yaml
Cache Key: v1-dependencies-{{ checksum "package-lock.json" }}
Fallback: v1-dependencies-
```

**Cache Invalidation:**
- Automatic when `package-lock.json` changes
- Manual: Change version prefix (v1 → v2)

### Test Result Storage

```yaml
- store_test_results:
    path: test-results  # JUnit XML files
- store_artifacts:
    path: coverage      # Coverage reports
```

**Access Results:**
- View in CircleCI UI under "Tests" tab
- Download artifacts from "Artifacts" tab
- Review coverage reports in HTML format

## Troubleshooting

### Build Fails: Dependencies

**Problem**: `npm ci` fails

**Solutions:**
```bash
# Locally
rm -rf node_modules package-lock.json
npm install
npm test

# In CircleCI, clear cache:
# Go to Project Settings > Clear Cache
```

### Build Fails: Tests

**Problem**: Tests pass locally but fail in CI

**Solutions:**
```bash
# Check Node version match
node --version  # Should match CircleCI executor

# Run tests with CI flag locally
npm run test:ci

# Check for timing issues
# Add timeouts to async tests
```

### Build Fails: Coverage Threshold

**Problem**: Coverage below 70%

**Solutions:**
- Add more tests to increase coverage
- Or temporarily lower threshold in `package.json`:

```json
"jest": {
  "coverageThreshold": {
    "global": {
      "branches": 60,
      "functions": 60,
      "lines": 60,
      "statements": 60
    }
  }
}
```

### Slow Builds

**Solutions:**
1. **Use cache effectively**: Ensure dependencies are cached
2. **Parallel jobs**: Already configured
3. **Smaller executor**: Use `small` resource class:

```yaml
resource_class: small  # or medium, large
```

## Customization

### Add Deployment Job

```yaml
jobs:
  deploy-production:
    executor: node-executor
    steps:
      - attach_workspace:
          at: ~/repo
      - run:
          name: Deploy to Production
          command: |
            # Your deployment commands
            npm run deploy:prod

workflows:
  build-test-deploy:
    jobs:
      # ... existing jobs
      - deploy-production:
          requires:
            - all-tests-pass
          filters:
            branches:
              only: main
```

### Add Slack Notifications

```yaml
orbs:
  slack: circleci/slack@4.10.1

jobs:
  notify:
    executor: node-executor
    steps:
      - slack/notify:
          event: fail
          template: basic_fail_1
```

### Add Docker Build

```yaml
jobs:
  build-docker:
    docker:
      - image: cimg/base:stable
    steps:
      - checkout
      - setup_remote_docker
      - run:
          name: Build Docker Image
          command: |
            docker build -t globomantics-api:$CIRCLE_SHA1 .
      - run:
          name: Push to Registry
          command: |
            docker push globomantics-api:$CIRCLE_SHA1
```

## Best Practices

### 1. Keep Builds Fast

- ✅ Use caching aggressively
- ✅ Run jobs in parallel
- ✅ Use `npm ci` instead of `npm install`
- ❌ Don't install unnecessary dependencies

### 2. Make Builds Reliable

- ✅ Pin dependency versions
- ✅ Use Docker images with specific tags
- ✅ Set appropriate timeouts
- ❌ Don't rely on external services without mocking

### 3. Security

- ✅ Use contexts for sensitive data
- ✅ Rotate API keys regularly
- ✅ Run security audits
- ❌ Don't commit secrets to config

### 4. Monitoring

- ✅ Review failed builds immediately
- ✅ Monitor build times
- ✅ Track coverage trends
- ✅ Set up notifications

## Resources

- [CircleCI Documentation](https://circleci.com/docs/)
- [CircleCI Node.js Guide](https://circleci.com/docs/language-javascript/)
- [CircleCI Orbs](https://circleci.com/developer/orbs)
- [Configuration Reference](https://circleci.com/docs/configuration-reference/)

## Support

For CircleCI-specific issues:
- Check [CircleCI Status](https://status.circleci.com/)
- Review [CircleCI Discuss](https://discuss.circleci.com/)
- Contact CircleCI support

For project-specific issues:
- Open an issue in the repository
- Check main README.md
- Review build logs in CircleCI UI

---

**Last Updated**: November 2024
