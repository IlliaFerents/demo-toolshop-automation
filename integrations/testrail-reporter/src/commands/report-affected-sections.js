import { buildSectionToCaseMap } from "../report.js";
import { config } from "../../config.js";
import EC from "eight-colors";
import { run as runReport } from "./single-section-report.js";
import { parseTestRailIdsFromFile } from "./parse-testail-ids.js";
import { execSync } from "child_process";
import path from "path";

const TESTS_DIR = "tests";

/**
 * Gets staged JS test files from git.
 */
const getChangedTestFiles = () => {
    try {
        const output = execSync(`git diff --name-only origin/main...HEAD`, { encoding: "utf-8" });
        const files = output
            .split("\n")
            .map((f) => f.trim())
            .filter((f) => f.endsWith(".js") && f.startsWith(TESTS_DIR));
        return files;
    } catch (error) {
        EC.logRed("❌ Error detecting changed test files:");
        EC.logRed(error.message);
        return [];
    }
};

/**
 * Extracts @testrail(...) IDs from changed test files.
 */
const extractTestRailIds = () => {
    const files = getChangedTestFiles();

    if (files.length === 0) {
        EC.logYellow("⚠️ No changed JS test files detected.");
        return [];
    }

    const ids = new Set();

    for (const file of files) {
        const matches = parseTestRailIdsFromFile(path.resolve(file));
        matches.forEach(({ testrailId }) => ids.add(parseInt(testrailId, 10)));
    }
    return Array.from(ids);
};

const run = async () => {
    const newCaseIds = extractTestRailIds();

    if (newCaseIds.length === 0) {
        EC.logYellow("⚠️ No new @testrail annotations found in staged test files.");
        return;
    }

    EC.logBlue(`🔍 Found ${newCaseIds.length} TestRail case IDs in changed files.`);

    const sectionToCasesMap = await buildSectionToCaseMap(config.projectId, config.suiteId);

    const affectedSectionIds = Object.entries(sectionToCasesMap)
        .filter(([, caseIds]) => caseIds.some((id) => newCaseIds.includes(id)))
        .map(([sectionId]) => parseInt(sectionId, 10));

    if (affectedSectionIds.length === 0) {
        EC.logYellow("⚠️ No matching sections found for extracted TestRail case IDs.");
        return;
    }

    EC.logGreen(`✅ Will generate reports for sections: ${affectedSectionIds.join(", ")}`);

    for (const sectionId of affectedSectionIds) {
        EC.logBlue(`➡️ Running report for section: ${sectionId}`);
        await runReport(sectionId);
    }
};

run();
