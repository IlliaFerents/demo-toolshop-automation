import fs from "node:fs";
import path from "path";
import { getTestFiles } from "./parse-testail-ids.js";
import { sendToSlack } from "../slack.js";
import { config } from "../../config.js";
import {
    TestRailReporterColors,
    testrailRegex,
    testrailObjectRegex,
    testBlockRegex
} from "../../constants/constants.js";

const { slackWebhookUrl } = config;
const testsDir = path.join(process.cwd(), "tests");
const MAX_BLOCK_TEXT = 3000; // Slack block content character limit

/**
 * Scans a file for `test()` blocks missing a nearby TestRail ID (comment or object format).
 * @param {string} filePath - Full path to the JS test file.
 * @returns {Array<Object>} - Array of unlinked test details.
 */
const extractUnlinkedTests = (filePath) => {
    const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
    const unlinked = [];

    lines.forEach((line, index) => {
        [...line.matchAll(testBlockRegex)].forEach(([, , testName = ""]) => {
            const nearbyLines = lines.slice(Math.max(0, index - 3), index);

            // Check for comment-based TestRail IDs (@testrail 123)
            const hasCommentTag = nearbyLines.some((l) => testrailRegex.test(l));

            // Check for object-based TestRail IDs (testrail: "123")
            const hasObjectTag = nearbyLines.some((l) => testrailObjectRegex.test(l));

            // Also check the current line and a few lines after for object-based IDs
            const contextLines = lines.slice(Math.max(0, index - 3), Math.min(lines.length, index + 10));
            const hasObjectTagInContext = contextLines.some((l) => testrailObjectRegex.test(l));

            if (!hasCommentTag && !hasObjectTag && !hasObjectTagInContext) {
                unlinked.push({
                    file: path.relative(testsDir, filePath),
                    line: index + 1,
                    testName: testName.trim().substring(0, 150)
                });
            }
        });
    });

    return unlinked;
};

/**
 * Formats unlinked test cases for Slack output.
 * @param {Array<Object>} tests - Array of unlinked test case details.
 * @returns {Array<string>} - Array of formatted lines.
 */
const formatUnlinkedTests = (tests) =>
    tests.map(({ file, line, testName }) => `*File:* \`${file}:${line}\`\n*Name:* ${testName}`);

/**
 * Builds a Slack payload message from the unlinked test cases list.
 * @param {Array<Object>} unlinkedTests - List of unlinked test cases.
 * @returns {Object} - Slack API payload.
 */
const buildSlackPayload = (unlinkedTests) => {
    const timestamp = new Date().toLocaleString();
    const count = unlinkedTests.length;

    const formattedLines = formatUnlinkedTests(unlinkedTests);
    const fullText = formattedLines.join("\n\n");

    let trimmedText = fullText;
    let overflowNote = "";

    if (fullText.length > MAX_BLOCK_TEXT) {
        const cutoff = fullText.lastIndexOf("\n\n", MAX_BLOCK_TEXT);
        trimmedText = fullText.slice(0, cutoff);
        const visibleCount = trimmedText.split("\n\n").length;
        overflowNote = `\n\n...and *${count - visibleCount}* more unlinked test blocks.`;
    }

    return {
        attachments: [
            {
                color: TestRailReporterColors.red,
                title: "Unlinked Tests Report",
                text: `⚠️ *${count}* unlinked test blocks found:\n\n${trimmedText}${overflowNote}`,
                footer: `Report generated: ${timestamp}`,
                mrkdwn_in: ["text"]
            }
        ]
    };
};

/**
 * Main function: scans all test files, finds unlinked tests,
 * builds and sends the Slack report.
 */
const run = async () => {
    const testFiles = getTestFiles(testsDir);
    const unlinkedTests = testFiles.flatMap(extractUnlinkedTests);

    const slackPayload = buildSlackPayload(unlinkedTests);
    await sendToSlack(slackWebhookUrl, slackPayload);
};

run();
