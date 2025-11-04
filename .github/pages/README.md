# GitHub Pages Landing Page

This directory contains the landing page for the Toolshop Test Automation project, deployed to GitHub Pages.

## Structure

- `index.html` - Main landing page
- `styles.css` - Playwright-inspired styling
- `script.js` - Dynamic functionality for loading test stats and reports

## Design

The landing page follows Playwright's design system:

- **Colors**: Green (#2D5E3F, #45A776) as primary, neutral grays
- **Typography**: System fonts for clean, modern look
- **Layout**: Responsive grid-based design
- **Components**: Feature cards, stats display, reports list

## Deployment

The workflow automatically:

1. Runs Playwright tests
2. Copies the landing page files to deployment directory
3. Copies the test report to `reports/latest/`
4. Deploys everything to GitHub Pages

## Future Enhancements

- Pull real test statistics from report JSON
- Display multiple historical reports
- Add test trend charts
- Show test coverage metrics
- Add filtering by test status/type
