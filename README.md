# Toolshop Test Automation

![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/IlliaFerents/demo-toolshop-automation?utm_source=oss&utm_medium=github&utm_campaign=IlliaFerents%2Fdemo-toolshop-automation&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)
[![Playwright](https://img.shields.io/badge/Playwright-v1.56-45ba4b?logo=playwright)](https://playwright.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)

Test automation framework for [Practice Software Testing](https://practicesoftwaretesting.com/) e-commerce platform using Playwright and modern QA practices.

## Features

- **Composite Page Objects** - Reusable components with custom fixtures for maintainable test architecture
- **TestRail Integration** - Automated test reporting with Slack notifications ([docs](integrations/testrail-reporter/README.md))
- **CI/CD Pipeline** - GitHub Actions with Docker, scheduled runs, and PR triggers ([docs](docs/ci-cd.md))
- **Custom Dashboard** - GitHub Pages with trend charts and historical tracking ([docs](.github/pages/README.md))
- **Advanced Testing** - 2FA automation, accessibility testing, UI/API hybrid scenarios ([docs](docs/testing-features.md))
- **Code Quality** - ESLint, Prettier, and pre-commit hooks ([docs](docs/development.md))

## Quick Start

```bash
# Install dependencies
npm install

# Run all tests
npx playwright test

# Run specific test suite
npx playwright test tests/checkout/

# Run with UI mode
npx playwright test --ui

# View test report
npx playwright show-report
```

## Project Structure

```
├── fixtures/              # Custom test fixtures
│   ├── page_fixtures.js   # Page object fixtures
│   └── a11y_fixtures.js   # Accessibility testing fixtures
├── pages/                 # Page Object Model
│   ├── home.page.js
│   ├── product.page.js
│   ├── checkout.page.js
│   └── ...
├── page-components/       # Reusable UI components
│   ├── header.component.js
│   └── filters.component.js
├── tests/                 # Test suites (organized by feature)
│   ├── auth/              # Login, registration, 2FA
│   ├── product/           # Product details, filters, sorting
│   ├── checkout/          # Checkout flow
│   ├── accessibility/     # A11y tests
│   └── ...
├── util/                  # Helper utilities
│   ├── api/               # API helpers (2FA, user management)
│   ├── random_data_generator/  # Faker.js test data
│   └── constants/         # URLs, categories, countries
├── integrations/          # Third-party integrations
│   └── testrail-reporter/ # TestRail + Slack reporter
└── .github/
    ├── workflows/         # CI/CD pipelines
    └── pages/             # GitHub Pages dashboard

```

## Tech Stack

| Category           | Tools                                       |
| ------------------ | ------------------------------------------- |
| **Test Framework** | Playwright v1.56                            |
| **Language**       | JavaScript (ES6+)                           |
| **Test Data**      | Faker.js v10.1                              |
| **Accessibility**  | axe-core/playwright v4.11                   |
| **2FA**            | otplib v12.0                                |
| **CI/CD**          | GitHub Actions, Docker                      |
| **Reporting**      | HTML Reports, TestRail, Slack, GitHub Pages |
| **Code Quality**   | ESLint, Prettier, Husky, lint-staged        |

## Documentation

- **[Architecture](docs/architecture.md)** - Page objects, fixtures, and component patterns
- **[Testing Features](docs/testing-features.md)** - 2FA, accessibility, API integration, data generation
- **[CI/CD](docs/ci-cd.md)** - GitHub Actions workflows and Docker setup
- **[Development](docs/development.md)** - Code quality tools and contribution guidelines
- **[TestRail Integration](integrations/testrail-reporter/README.md)** - Test case reporting and Slack updates
- **[GitHub Pages Dashboard](.github/pages/README.md)** - Custom reports and trend charts

## Test Execution

### Local

```bash
# Chrome only
npm run test:all:chrome

# Specific browser
npx playwright test --project=firefox

# With retries
npx playwright test --retries=2

# Headed mode
npx playwright test --headed
```

### Docker

```bash
# Build image
npm run docker:build

# Run tests in container
npm run docker:test

# Interactive shell
npm run docker:shell
```

## Environment Setup

Create `.env` file:

```env
# TestRail (optional)
TESTRAIL_HOST=https://your-instance.testrail.io
TESTRAIL_USER=your-email@domain.com
TESTRAIL_API_KEY=your-api-key
TESTRAIL_PROJECT_ID=1

# Slack (optional)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx
```

## License

MIT
