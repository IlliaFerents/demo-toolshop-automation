# TestRail Reporter Integration

Custom reporter for integrating Playwright test results with TestRail and Slack notifications.

## Features

- Parse `@testrail` IDs from test comments
- Automatically report test results to TestRail
- Send formatted summaries to Slack
- Validate TestRail ID consistency
- Generate reports by section/suite

## Usage

### Link Tests to TestRail

Add `@testrail` comment above test:

```javascript
/**
 * @testrail 123
 */
test("checkout with credit card", async ({ checkoutPage }) => {
    // test code
});
```

### Available Commands

```bash
# Parse all TestRail IDs
node src/commands/parse-testrail-ids.js

# Validate IDs exist in TestRail
node src/commands/validate-testrail-ids.js

# Report entire suite
node src/commands/suite-report.js

# Find tests without IDs
node src/commands/unlinked-tests-report.js
```

## Slack Notifications

Automated summaries sent to configured channel:

```
✅ Test Run Complete: Sprint 23

📊 Results:
• Total: 32 tests
• ✅ Passed: 30 (93.75%)
• ❌ Failed: 2 (6.25%)
• ⚠️ Flaky: 0

🔗 View in TestRail
```

## Best Practices

1. **Sequential IDs**: Use consecutive TestRail case IDs
2. **Match Names**: Test names should match TestRail case titles
3. **Validate Before Commit**: Run `validate-testrail-ids.js` regularly
4. **Link All Tests**: Avoid unlinked tests
