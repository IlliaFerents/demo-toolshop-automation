import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    // Look for test files in the "tests" directory, relative to this configuration file.
    testDir: "tests",

    // Run all tests in parallel.
    fullyParallel: false,

    // Fail the build on CI if you accidentally left test.only in the source code.
    forbidOnly: !!process.env.CI,

    // Retry on CI only.
    retries: process.env.CI ? 2 : 0,

    // Opt out of parallel tests on CI.
    workers: process.env.CI ? 1 : undefined,

    // Reporter to use
    reporter: [["html"], ["json", { outputFile: "playwright-report/results.json" }]],

    // Global setup - runs once per test session
    globalSetup: "./setup/global.setup.js",

    // Global teardown - runs once when session ends
    globalTeardown: "./setup/global.teardown.js",

    use: {
        // Base URL to use in actions like `await page.goto('/')`.
        baseURL: "https://practicesoftwaretesting.com/",

        // Collect trace when retrying the failed test.
        trace: "on-first-retry",

        // Capture video on failure
        video: "retain-on-failure",

        // Capture screenshot on failure
        screenshot: "only-on-failure",

        testIdAttribute: "data-test"
    },
    // Configure projects for major browsers.
    projects: [
        {
            name: "chromium",
            use: {
                ...devices["Desktop Chrome"],
                storageState: "playwright/.auth/user.json"
            }
        }
    ]
});
