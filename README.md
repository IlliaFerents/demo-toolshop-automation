# GitHub Pages Landing Page

This directory contains the landing page for the Toolshop Test Automation project, deployed to GitHub Pages.

## Structure

- `index.html` - Main landing page with stats, trends, and reports
- `styles.css` - Playwright-inspired styling with CSS bar charts
- `script.js` - Dynamic functionality for loading manifest data

## Features

### 1. Real-time Test Stats

- Pulls data from `reports/manifest.json`
- Shows total tests, last run time, and status
- Updates automatically with each deployment

### 2. Historical Reports

- Keeps last 20 reports organized by run number
- Always maintains a `latest/` symlink
- Auto-deletes reports older than 15 runs

### 3. Test Trends Chart

- Pure CSS bar chart (no dependencies)
- Displays last 7 test runs
- Color-coded: Passed (green), Failed (red), Flaky (orange)
- Responsive design for mobile

## Deployment

The workflow automatically:

1. Runs Playwright tests
2. Generates `manifest.json` with test statistics
3. Copies report to `reports/run-{number}/` and `reports/latest/`
4. Cleans up old reports (keeps last 15)
5. Deploys everything to GitHub Pages

## Manifest Format

```json
{
  "latest": {
    "runNumber": 123,
    "stats": {
      "total": 10,
      "passed": 9,
      "failed": 1,
      "flaky": 0,
      "passRate": 90
    }
  },
  "reports": [...],
  "trends": {
    "passRate": 5,
    "total": 0
  }
}
```

## Design

The landing page follows Playwright's design system:

- **Colors**: Green (#2D5E3F, #45A776) as primary, neutral grays
- **Typography**: System fonts for clean, modern look
- **Layout**: Responsive grid-based design
- **Components**: Feature cards, stats display, reports list
