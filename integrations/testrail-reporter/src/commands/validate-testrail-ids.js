import path from "path";
import { getCases } from "../client.js";
import { config } from "../../config.js";
import { sendToSlack } from "../slack.js";
import { automationMapping } from "../report.js";
import { parseAllTestRailIds } from "./parse-testail-ids.js";
import { TestRailReporterColors } from "../../constants/constants.js";

const { projectId, suiteId, slackWebhookUrl } = config;
const testsDir = path.join(process.cwd(), "tests");

/**
 * Retrieves all TestRail test cases for the given project and suite.
 */
async function retrieveTestRailTestCases() {
    try {
        return await getCases(projectId, suiteId);
    } catch (error) {
        await postSlackMessage({
            header: "Error Retrieving TestRail Cases",
            attachments: [
                {
                    color: TestRailReporterColors.red,
                    blocks: [
                        {
                            type: "section",
                            text: { type: "mrkdwn", text: `*Error:* ${error.message || error}` }
                        }
                    ]
                }
            ]
        });
        process.exit(1);
    }
}

/**
 * Posts a Slack message using the provided payload.
 */
async function postSlackMessage(messagePayload) {
    try {
        await sendToSlack(slackWebhookUrl, messagePayload);
    } catch (error) {
        console.error("Failed to send Slack message:", error);
        process.exit(1);
    }
}

/**
 * Checks for duplicate TestRail IDs in the parsed TAF test cases.
 * This function now handles legitimate parameterized test scenarios where
 * the same TestRail ID is used multiple times within the same file.
 */
function checkForDuplicateIds(tafTestCases) {
    const frequency = {};
    const fileGroups = {};

    // Group test cases by TestRail ID and track file locations
    tafTestCases.forEach((record) => {
        const id = record.testrailId;
        frequency[id] = (frequency[id] || 0) + 1;

        if (!fileGroups[id]) {
            fileGroups[id] = {};
        }
        if (!fileGroups[id][record.file]) {
            fileGroups[id][record.file] = [];
        }
        fileGroups[id][record.file].push(record);
    });

    // Filter out legitimate duplicates (same ID in same file, likely parameterized tests)
    return Object.entries(frequency)
        .filter(([id, count]) => {
            if (count <= 1) return false;

            const files = Object.keys(fileGroups[id]);

            // If all occurrences are in the same file, check if they're close together (likely parameterized)
            if (files.length === 1) {
                const records = fileGroups[id][files[0]];
                const lines = records.map((r) => r.line).sort((a, b) => a - b);
                const maxLineGap = Math.max(...lines) - Math.min(...lines);

                // If all occurrences are within 30 lines of each other, likely parameterized tests
                if (maxLineGap <= 30) {
                    return false;
                }
            }

            return true;
        })
        .map(([id, count]) => ({
            testrailId: id,
            count,
            files: Object.keys(fileGroups[id]),
            locations: Object.entries(fileGroups[id]).map(([file, records]) => ({
                file: path.relative(process.cwd(), file),
                lines: records.map((r) => r.line)
            }))
        }));
}

/**
 * Validates that each TAF TestRail ID exists in TestRail.
 */
async function validateExistence(tafTestCases) {
    const trTestCases = await retrieveTestRailTestCases();
    const validTRIds = new Set(trTestCases.map((tc) => Number(tc.id)));
    return tafTestCases.filter((record) => {
        const tafId = Number(record.testrailId);
        return !validTRIds.has(tafId);
    });
}

/**
 * Validates that each TAF test case is marked as automated in TestRail.
 * custom_automation_type of 0 indicates automated.
 */
async function validateAutomationStatus(tafTestCases) {
    const trTestCases = await retrieveTestRailTestCases();
    const trMap = new Map(trTestCases.map((tc) => [Number(tc.id), tc]));
    const automationStatusMismatches = [];
    const EXPECTED_AUTOMATION_CODE = 0;

    tafTestCases.forEach((record) => {
        const tafId = Number(record.testrailId);
        if (trMap.has(tafId)) {
            const trRecord = trMap.get(tafId);
            if (trRecord.custom_automation_type !== EXPECTED_AUTOMATION_CODE) {
                automationStatusMismatches.push({
                    testrailId: tafId,
                    actual: trRecord.custom_automation_type,
                    file: record.file,
                    line: record.line
                });
            }
        }
    });
    return automationStatusMismatches;
}

/**
 * Builds the Slack payload with color-coded attachments.
 */
function buildValidationPayload({
    header,
    invalidText,
    duplicateText,
    automationText,
    invalidColor,
    duplicateColor,
    automationColor
}) {
    const currentTime = new Date().toLocaleString();

    const headerAttachment = {
        blocks: [
            {
                type: "header",
                text: { type: "plain_text", text: header, emoji: true }
            }
        ]
    };

    const invalidAttachment = {
        color: invalidColor,
        blocks: [
            {
                type: "section",
                text: { type: "mrkdwn", text: `*Invalid TestRail IDs:*\n${invalidText}` }
            }
        ]
    };

    const duplicateAttachment = {
        color: duplicateColor,
        blocks: [
            {
                type: "section",
                text: { type: "mrkdwn", text: `*Duplicate TestRail IDs:*\n${duplicateText}` }
            }
        ]
    };

    const automationAttachment = {
        color: automationColor,
        blocks: [
            {
                type: "section",
                text: { type: "mrkdwn", text: `*Automation Status Mismatches:*\n${automationText}` }
            }
        ]
    };

    const contextAttachment = {
        blocks: [
            {
                type: "context",
                elements: [{ type: "mrkdwn", text: `Report generated: ${currentTime}` }]
            }
        ]
    };

    return {
        attachments: [headerAttachment, invalidAttachment, duplicateAttachment, automationAttachment, contextAttachment]
    };
}

/**
 * Main function: re-parse TestRail IDs and run validations, then post Slack report.
 */
async function run() {
    const tafTestCases = parseAllTestRailIds(testsDir);

    // Validate existence of IDs.
    const invalidIds = await validateExistence(tafTestCases);
    const invalidColor = invalidIds.length === 0 ? TestRailReporterColors.green : TestRailReporterColors.red;
    const invalidText =
        invalidIds.length === 0
            ? "✅ All TAF TestRail IDs are valid."
            : `⚠️ ${invalidIds.length} invalid ID(s) found:\n` +
              invalidIds
                  .map((record) => `• File: ${record.file} (Line ${record.line}) => \`${record.testrailId}\``)
                  .join("\n");

    // Validate duplicate IDs.
    const duplicates = checkForDuplicateIds(tafTestCases);
    const duplicateColor = duplicates.length === 0 ? TestRailReporterColors.green : TestRailReporterColors.red;
    const duplicateText =
        duplicates.length === 0
            ? "✅ No duplicate TestRail IDs found in TAF."
            : `⚠️ Duplicate IDs found:\n` +
              duplicates.map((dup) => `• ID \`${dup.testrailId}\` appears ${dup.count} times`).join("\n");

    // Validate automation status.
    const automationMismatches = await validateAutomationStatus(tafTestCases);
    const automationColor =
        automationMismatches.length === 0 ? TestRailReporterColors.green : TestRailReporterColors.red;
    const mismatchLines = automationMismatches.map((m) => {
        const actualLabel = automationMapping[m.actual] || `Unknown [${m.actual}]`;
        const relativePath = path.relative(testsDir, m.file);
        return `• *ID:* \`${m.testrailId}\`, *Status:* ${actualLabel}\n *File:* ${relativePath}:${m.line}`;
    });

    const automationText =
        automationMismatches.length === 0
            ? "✅ All automated test cases are correctly marked in TestRail."
            : `⚠️ ${automationMismatches.length} automation status mismatch(es) found:\n\n` +
              mismatchLines.join("\n\n");

    const header = "TAF TestRail ID Validation Report";
    const payload = buildValidationPayload({
        header,
        invalidText,
        duplicateText,
        automationText,
        invalidColor,
        duplicateColor,
        automationColor
    });

    await postSlackMessage(payload);
}

run();
