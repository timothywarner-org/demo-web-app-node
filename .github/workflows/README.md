# GitHub Actions Workflows

## Overview

This directory contains GitHub Actions workflows for CI/CD automation of the Globomantics Robotics API.

## Workflows

### 1. CI Pipeline (`ci.yml`)

**Trigger**: Push and Pull Requests to main, master, develop branches

**Purpose**: Continuous Integration testing and validation

**Jobs:**

1. **Lint** - Code style and quality checks with ESLint
2. **Security** - Dependency vulnerability scanning with npm audit and Snyk
3. **Test** - Unit and integration tests on Node 18, 20, and 21
4. **Build** - Verify application starts successfully
5. **Quality** - Code coverage and SonarCloud analysis
6. **Integration** - Full API integration tests
7. **Test Summary** - Aggregate and publish test results

**Artifacts:**
- Test results (JUnit XML)
- Coverage reports (HTML, LCOV)
- Server startup logs
- Integration test results

**Matrix Testing:**
```yaml
strategy:
  matrix:
    node-version: [18, 20, 21]
```

### 2. Release Pipeline (`release.yml`)

**Trigger**: Push of version tags (v*.*.*)

**Purpose**: Automated release creation and deployment

**Jobs:**

1. **Validate** - Verify tests pass and version matches tag
2. **Build** - Create release artifacts (tar.gz bundle)
3. **Release** - Create GitHub release with changelog
4. **Publish NPM** - Publish to npm registry (if configured)
5. **Docker** - Build and push Docker images
6. **Deploy** - Deploy to production environment
7. **Notify** - Send notifications (Slack, etc.)

**Version Tag Format:**
```bash
git tag v1.0.0
git push origin v1.0.0
```

**Release Types:**
- `v1.0.0` - Production release
- `v1.0.0-beta.1` - Beta pre-release
- `v1.0.0-alpha.1` - Alpha pre-release
- `v1.0.0-rc.1` - Release candidate

### 3. Code Quality (`code-quality.yml`)

**Trigger**:
- Push/PR to main, master, develop branches
- Weekly schedule (Sunday midnight)

**Purpose**: Comprehensive code quality analysis

**Jobs:**

1. **Lint** - ESLint checks with JSON report
2. **Security** - npm audit and Snyk scanning
3. **Dependencies** - Check for outdated packages and licenses
4. **Complexity** - Code complexity analysis
5. **Coverage** - Test coverage analysis and reporting
6. **Docs** - Documentation completeness check
7. **Summary** - Aggregate quality metrics

**Reports Generated:**
- ESLint report (JSON)
- npm audit report
- Outdated dependencies
- License report
- Complexity analysis
- Duplicate code detection
- Coverage reports

## Setup Instructions

### 1. Enable GitHub Actions

GitHub Actions is enabled by default for public repositories. For private repositories:

1. Go to repository Settings
2. Click "Actions" in the left sidebar
3. Select "Allow all actions and reusable workflows"

### 2. Required Secrets

Add these secrets in repository Settings > Secrets and variables > Actions:

#### Optional but Recommended:

```bash
# For Snyk security scanning
SNYK_TOKEN=your_snyk_token

# For SonarCloud code analysis
SONAR_TOKEN=your_sonar_token

# For npm publishing
NPM_TOKEN=your_npm_token

# For Docker Hub (optional)
DOCKER_USERNAME=your_docker_username
DOCKER_PASSWORD=your_docker_password

# For Slack notifications
SLACK_WEBHOOK_URL=your_slack_webhook_url

# For Codecov (optional, can use without token for public repos)
CODECOV_TOKEN=your_codecov_token
```

### 3. Configure Branch Protection

Recommended branch protection rules for `main`:

1. Go to Settings > Branches
2. Add rule for `main` branch
3. Enable:
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - Required checks:
     - Lint Code
     - Test on Node 18
     - Build Verification
     - Integration Tests
   - ✅ Require pull request reviews before merging (1 reviewer)
   - ✅ Dismiss stale pull request approvals when new commits are pushed
   - ✅ Include administrators

### 4. Setup Codecov (Optional)

For coverage tracking:

1. Sign up at [Codecov](https://codecov.io/)
2. Connect your GitHub repository
3. Codecov will automatically receive uploads from CI
4. Add badge to README:

```markdown
[![codecov](https://codecov.io/gh/USERNAME/REPO/branch/main/graph/badge.svg)](https://codecov.io/gh/USERNAME/REPO)
```

### 5. Setup SonarCloud (Optional)

For advanced code quality analysis:

1. Sign up at [SonarCloud](https://sonarcloud.io/)
2. Import your GitHub repository
3. Get your SONAR_TOKEN
4. Add token to GitHub secrets
5. Create `sonar-project.properties`:

```properties
sonar.projectKey=your_project_key
sonar.organization=your_organization
sonar.sources=src
sonar.tests=tests
sonar.javascript.lcov.reportPaths=coverage/lcov.info
```

## Workflow Features

### Caching

All workflows use npm caching for faster builds:

```yaml
- uses: actions/setup-node@v4
  with:
    cache: 'npm'
```

### Matrix Testing

Test on multiple Node versions simultaneously:

```yaml
strategy:
  matrix:
    node-version: [18, 20, 21]
  fail-fast: false  # Continue even if one version fails
```

### Artifact Storage

Test results and reports are stored as artifacts:

```yaml
- uses: actions/upload-artifact@v3
  with:
    name: test-results
    path: test-results/
```

Access artifacts:
1. Go to Actions tab
2. Select workflow run
3. Scroll to "Artifacts" section
4. Download reports

### Job Dependencies

Jobs run in order based on dependencies:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest

  deploy:
    needs: test  # Waits for test to complete
    runs-on: ubuntu-latest
```

### Conditional Execution

Run jobs only when conditions are met:

```yaml
if: github.ref == 'refs/heads/main'  # Only on main branch
if: always()  # Always run, even if previous jobs fail
if: success()  # Only if previous jobs succeed
```

## Usage Examples

### Running Locally

Simulate GitHub Actions locally with [act](https://github.com/nektos/act):

```bash
# Install act
brew install act  # macOS
# or
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Run default workflow
act

# Run specific workflow
act -W .github/workflows/ci.yml

# Run specific job
act -j test
```

### Manual Workflow Trigger

Add manual trigger to workflows:

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy to'
        required: true
        default: 'staging'
```

Then trigger from GitHub UI:
1. Go to Actions tab
2. Select workflow
3. Click "Run workflow"

### Creating Releases

```bash
# Ensure you're on main branch
git checkout main
git pull

# Update version in package.json
npm version patch  # 1.0.0 -> 1.0.1
# or
npm version minor  # 1.0.0 -> 1.1.0
# or
npm version major  # 1.0.0 -> 2.0.0

# Push tag (triggers release workflow)
git push origin main --tags
```

## Monitoring and Debugging

### View Workflow Runs

1. Go to repository's "Actions" tab
2. See all workflow runs
3. Click on run to see details
4. View logs for each job

### Debug Mode

Enable debug logging:

1. Go to Settings > Secrets
2. Add secret: `ACTIONS_STEP_DEBUG` = `true`
3. Re-run workflow
4. See detailed debug logs

### Job Summaries

Workflows generate summaries visible in the Actions tab:

```yaml
- run: |
    echo "## Test Results" >> $GITHUB_STEP_SUMMARY
    echo "✅ All tests passed" >> $GITHUB_STEP_SUMMARY
```

## Best Practices

### 1. Keep Workflows Fast

- ✅ Use caching aggressively
- ✅ Run independent jobs in parallel
- ✅ Use `npm ci` instead of `npm install`
- ✅ Cache Docker layers

### 2. Security

- ✅ Use secrets for sensitive data
- ✅ Pin action versions: `actions/checkout@v4`
- ✅ Review action permissions
- ✅ Use `GITHUB_TOKEN` with minimal permissions

### 3. Reliability

- ✅ Set appropriate timeouts
- ✅ Use `continue-on-error` for non-critical steps
- ✅ Handle flaky tests
- ✅ Add retries for network operations

### 4. Maintainability

- ✅ Use reusable workflows
- ✅ Document workflow purposes
- ✅ Keep workflows DRY (Don't Repeat Yourself)
- ✅ Use clear job and step names

## Troubleshooting

### Build Fails: npm ci

**Problem**: `npm ci` fails with lock file errors

**Solution**:
```bash
# Locally
rm package-lock.json
npm install
git add package-lock.json
git commit -m "Update package-lock.json"
git push
```

### Build Fails: Permission Denied

**Problem**: Cannot push Docker image or create release

**Solution**: Check repository permissions and secrets

### Slow Builds

**Solutions**:
1. Check cache is working
2. Reduce test parallelism
3. Use `ubuntu-latest-4-cores` for more CPU
4. Split into multiple workflows

### Intermittent Failures

**Solutions**:
1. Add retries for network operations
2. Increase timeouts
3. Check for timing issues in tests
4. Use `continue-on-error` for flaky steps

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [Available Actions](https://github.com/marketplace?type=actions)
- [GitHub Actions Community](https://github.community/c/github-actions)

## Migration from Other CI Systems

### From CircleCI

- CircleCI `docker` → GitHub Actions `runs-on`
- CircleCI `workflows` → GitHub Actions `jobs`
- CircleCI `orbs` → GitHub Actions `actions`

### From Travis CI

- `.travis.yml` → `.github/workflows/*.yml`
- Travis `script` → GitHub Actions `run`
- Travis `matrix` → GitHub Actions `strategy.matrix`

## Support

For workflow issues:
- Check [GitHub Status](https://www.githubstatus.com/)
- Review workflow logs in Actions tab
- Open issue in repository
- Check GitHub Actions documentation

---

**Last Updated**: November 2024
