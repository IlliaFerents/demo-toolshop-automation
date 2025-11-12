import fs from "node:fs";
import path from "path";

const authFile = "playwright/.auth/user.json";

/**
 * Global teardown - runs once when test session ends
 * Deletes the auth file so next session gets a fresh user
 */
async function globalTeardown() {
    console.log("\n🧹 Running global teardown...");
    const authPath = path.resolve(authFile);

    if (fs.existsSync(authPath)) {
        fs.unlinkSync(authPath);
        console.log(`✅ Deleted auth file: ${authFile}`);
        console.log("   Next session will create a fresh user\n");
    } else {
        console.log(`⚠️  Auth file not found at ${authFile}\n`);
    }
}

export default globalTeardown;
