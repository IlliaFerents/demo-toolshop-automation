# Architecture

Test framework built on **Page Object Model** with composite components and custom fixtures.

## Page Object Model

Each page is a class with locators and methods:

```javascript
class CheckoutPage {
    constructor(page) {
        this.page = page;
        this.proceedButton = page.locator("[data-test='proceed-1']");
    }

    async goToCheckout() {
        await this.page.goto("/checkout");
    }
}
```

**Principles:**

- Locator priority: `data-test` > `id` > `class` > `text`
- Single responsibility: one page = one class
- No assertions in page objects

## Composite Components

Reusable UI components shared across pages:

```javascript
class HeaderComponent {
    constructor(page) {
        this.signInLink = page.locator("[data-test='nav-sign-in']");
    }
}

// Used in multiple pages
class HomePage {
    constructor(page) {
        this.header = new HeaderComponent(page);
    }
}
```

## Custom Fixtures

Centralized page object initialization:

```javascript
export const test = base.extend({
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    }
});
```

**Benefits:** No manual instantiation, automatic cleanup, consistent setup

## Test Organization

Feature-based structure:

```
tests/
├── auth/          # Login, registration, 2FA
├── product/       # Details, filters, sorting
├── checkout/      # Checkout flow
└── accessibility/ # A11y tests
```

**Naming:** `feature.spec.js`, `feature.page.js`, `component.component.js`

## Global Setup

Authentication handled globally to avoid repeated logins:

```javascript
// setup/global.setup.js
export default async function globalSetup() {
    // Login once and save state
    await page.context().storageState({
        path: "playwright/.auth/user.json"
    });
}
```

Tests reuse: `storageState: "playwright/.auth/user.json"`

## Design Patterns

**Factory:** Data generators for test data  
**Fluent Interface:** Chainable methods for readability  
**Strategy:** Polymorphic handling of payment methods
