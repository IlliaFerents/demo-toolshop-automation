# Testing Features

Advanced testing capabilities built into the framework.

## 2FA Automation

TOTP-based two-factor authentication using `otplib`:

```javascript
import { authenticator } from "otplib";

export function generateTOTPCode(secret) {
    return authenticator.generate(secret);
}
```

**Test Flow:** Register user via API → Enable 2FA → Generate TOTP code → Login with code

## Accessibility Testing

Automated a11y audits using `@axe-core/playwright`:

```javascript
test("home page meets accessibility standards", async ({ homePage, a11y }) => {
    await homePage.goToHomePage();

    const results = await a11y.analyze();
    a11y.assertNoViolations(results);
});
```

**Covered Pages:** Home, Login, Registration, Product, Contact  
**Tag:** `@a11y`

## UI/API Hybrid Scenarios

Combine UI and API for efficient testing:

**Use Cases:**

- Setup via API (create test data)
- Validation via API (verify backend state)
- Teardown via API (cleanup)

```javascript
test("checkout updates inventory", async ({ checkoutPage }) => {
    // UI: Complete checkout
    await checkoutPage.completeCheckout(cardData);

    // API: Verify inventory decreased
    const product = await getProduct(productId);
    expect(product.stock).toBe(initialStock - 1);
});
```

## Random Test Data Generation

Faker.js for dynamic, realistic data:

```javascript
export function generateUserSignUpData() {
    return {
        firstName: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 12 })
        // ... more fields
    };
}

export function generateCardDetails() {
    return {
        cardNumber: faker.finance.creditCardNumber({ issuer: "####-####-####-####" }),
        cvv: faker.finance.creditCardCVV()
        // ... more fields
    };
}
```

**Benefits:** Unique data per run, realistic values, easy maintenance

**Available Generators:**

- `generateUserSignUpData()` - Complete user profile
- `generateCardDetails()` - Credit card info
- `getRandomArrayElement(array)` - Random item

## Test Tags

Organize and filter tests by feature:

```javascript
test.describe("Checkout", { tag: "@checkout" }, () => {
    test("complete purchase", async ({ checkoutPage }) => {
        // test code
    });
});
```

**Tags:** `@auth`, `@checkout`, `@payment`, `@a11y`, `@smoke`

```bash
npx playwright test --grep @smoke
npx playwright test --grep-invert @a11y  # exclude
```

## TestRail Integration

Link tests to TestRail cases:

```javascript
/**
 * @testrail 30
 */
test("checkout with credit card", async ({ checkoutPage }) => {
    // test code
});
```

Automatically parses IDs, reports results to TestRail, posts to Slack.

See [TestRail Reporter docs](../integrations/testrail-reporter/README.md) for setup.
