# CI/CD

GitHub Actions workflows for automated testing across environments.

## Workflows

### CI E2E Tests

**Trigger:** Pull requests to main  
**Runs:** Chromium tests, generates manifest, deploys to GitHub Pages

### Scheduled Tests

**Trigger:** Mondays at 7:00 AM UTC  
**Purpose:** Regular smoke tests, monitor production health

### Docker Tests

**Trigger:** Manual  
**Purpose:** Consistent environment testing

## GitHub Pages Deployment

Each PR run deploys test report to GitHub Pages:

- Dashboard with trends and stats
- Historical reports (keeps last 15)
- Always-updated `latest/` symlink

See [GitHub Pages docs](../.github/pages/README.md) for dashboard details.

## Docker

```bash
# Build & run
npm run docker:build
npm run docker:test

# Interactive shell
npm run docker:shell
```

**Benefits:** Consistent environment, pre-installed browsers, isolated execution

## GitHub Secrets

Required for CI workflows:

| Secret                | Purpose               |
| --------------------- | --------------------- |
| `TESTRAIL_HOST`       | TestRail instance URL |
| `TESTRAIL_USER`       | TestRail username     |
| `TESTRAIL_API_KEY`    | TestRail API key      |
| `TESTRAIL_PROJECT_ID` | Project ID            |
| `SLACK_WEBHOOK_URL`   | Slack notifications   |

Set in **Settings → Secrets → Actions**

## Configuration

- **Parallelization:** Sequential on CI, parallel locally
- **Retries:** 2 on CI, 0 locally
- **Caching:** npm dependencies cached
- **Artifacts:** Reports retained 10 days
- **Timeout:** 30 minutes
