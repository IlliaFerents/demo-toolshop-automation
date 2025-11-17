# Development

Code quality tools and contribution guidelines.

## Code Quality Tools

### ESLint

JavaScript linter with Playwright plugin - runs automatically on commit.

```bash
npx eslint .
npx eslint --fix .  # Auto-fix issues
```

### Prettier

Code formatter with project standards:

- 4 spaces indentation
- Double quotes
- Semicolons always
- 120 character line length

```bash
npx prettier --write .
```

### Husky + lint-staged

Pre-commit hooks automatically lint and format staged files.

```bash
npm run prepare  # Initialize hooks
git commit --no-verify  # Skip hooks (emergency only)
```

## Project Standards

### Naming Conventions

| Type       | Convention         | Example               |
| ---------- | ------------------ | --------------------- |
| Files      | `kebab-case.js`    | `checkout.page.js`    |
| Classes    | `PascalCase`       | `CheckoutPage`        |
| Functions  | `camelCase`        | `goToCheckout()`      |
| Constants  | `UPPER_SNAKE_CASE` | `BASE_URL`            |
| Test files | `*.spec.js`        | `checkout.spec.js`    |
| Components | `*.component.js`   | `header.component.js` |

### Test Structure

```javascript
test.describe("Feature Name", { tag: "@feature" }, () => {
    /**
     * @testrail 123
     */
    test("should do something", async ({ fixture }) => {
        // Arrange
        await page.goto("/path");

        // Act
        await page.click("button");

        // Assert
        await expect(page).toHaveURL(/success/);
    });
});
```

**Best Practices:**

- Use `data-test` attributes for locators
- Prefer `toHaveText()` over `textContent()`
- Add TestRail IDs with `@testrail` comment
- Tag tests for filtering

### Commit Messages

Follow conventional commits:

```
feat: add checkout page object
fix: resolve flaky 2FA test
docs: update README
refactor: extract payment methods
test: add accessibility tests
chore: update dependencies
```

## Testing

### Quick Commands

```bash
# Single file
npx playwright test tests/checkout/checkout.spec.js

# Single test by name
npx playwright test -g "checkout with credit card"

# Specific browser
npx playwright test --project=firefox

# UI mode
npx playwright test --ui

# View report
npx playwright show-report
```

### Debug Mode

```bash
# Headed mode (see browser)
npx playwright test --headed

# Debug with inspector
npx playwright test --debug

# Trace viewer
npx playwright test --trace on
npx playwright show-trace trace.zip
```

## Contribution Workflow

1. Fork & clone repository
2. Create feature branch: `git checkout -b feat/feature-name`
3. Make changes (TDD approach)
4. Test locally: `npx playwright test`
5. Commit (hooks run automatically)
6. Push & open PR
