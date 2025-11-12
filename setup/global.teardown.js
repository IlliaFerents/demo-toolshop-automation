import fs from "node:fs";
import path from "path";
import logger from "../util/logger/logger.js";

const authFile = "playwright/.auth/user.json";

/**
 * Global teardown - runs once when test session ends
 * Deletes the auth file so next session gets a fresh user
 */
async function globalTeardown() {
    logger.log("info", "🧹 Running global teardown...");
    const authPath = path.resolve(authFile);

    if (fs.existsSync(authPath)) {
        fs.unlinkSync(authPath);
        logger.log("info", `✅ Deleted auth file: ${authFile}`);
        logger.log("info", "   Next session will create a fresh user\n");
    } else {
        logger.log("warn", `Auth file not found at ${authFile}\n`);
    }
}

export default globalTeardown;
