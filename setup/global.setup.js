import { chromium } from "@playwright/test";
import UserAPI from "../util/api/user.js";
import { generateUserSignUpData } from "../util/random_data_generator/user.js";
import { env } from "../env.js";
import logger from "../util/logger/logger.js";
import fs from "node:fs";

const authFile = "playwright/.auth/user.json";

/**
 * Global setup - runs once per test session
 * Creates a new user and saves authenticated state
 */
async function globalSetup() {
    logger.log("info", "🔧 Starting global authentication setup...");

    if (fs.existsSync(authFile)) {
        logger.log("warn", `Auth file already exists at ${authFile}`);
        logger.log("warn", "   Deleting existing auth file to create fresh user...");
        fs.unlinkSync(authFile);
    }

    const browser = await chromium.launch();
    const page = await browser.newPage();
    const userAPI = new UserAPI(page);

    try {
        const userData = generateUserSignUpData();

        await userAPI.register(userData);
        logger.log("info", `✓ Registered user: ${userData.email}`);

        const loginResponse = await userAPI.login(userData.email, userData.password);
        logger.log("info", `✓ Login successful`);
        const token = loginResponse.access_token;

        if (!token) {
            throw new Error("Failed to retrieve access token from login response");
        }

        await page.goto(env.BASE_URL);

        await page.evaluate((authToken) => {
            localStorage.setItem("auth-token", authToken);
        }, token);

        await page.context().storageState({ path: authFile });

        logger.log("info", `✅ Authentication setup complete. Storage state saved to ${authFile}`);
        logger.log("info", `   Token expires in 300 seconds (5 minutes)\n`);
    } finally {
        await browser.close();
    }
}

export default globalSetup;
