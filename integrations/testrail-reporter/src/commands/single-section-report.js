import EC from "eight-colors";
import { getSections, getCases } from "../client.js";
import { getChildSectionIds, summarizeAutomation, computeMetrics } from "../report.js";
import { sendToSlack, getColorForCoverage } from "../slack.js";
import { config } from "../../config.js";

const { projectId, suiteId, slackWebhookUrl } = config;

/**
 * Recursively builds breadcrumb path from section ID.
 * @param {Array} allSections - List of all TestRail sections.
 * @param {number} sectionId - Current section ID to build path from.
 * @returns {string} Breadcrumb string like "Simple Search / Search Results / People Tab"
 */
const buildBreadcrumb = (allSections, sectionId) => {
    const path = [];
    let currentId = sectionId;

    while (currentId) {
        const section = allSections.find((s) => s.id === currentId);
        if (!section) break;
        path.unshift(section.name);
        currentId = section.parent_id;
    }

    return path.join(" / ");
};

/**
 * Prepares all relevant test cases based on optional section ID.
 */
const fetchRelevantTestCases = async (sectionId) => {
    const numericSectionId = parseInt(sectionId);
    const sections = await getSections(projectId, suiteId);

    if (!sections?.length) {
        EC.logRed("No sections found; falling back to entire suite.");
        return { cases: await getCases(projectId, suiteId), sectionName: "" };
    }

    if (!numericSectionId) {
        return { cases: await getCases(projectId, suiteId), sectionName: "" };
    }

    const sectionIds = getChildSectionIds(sections, numericSectionId);
    const sectionName = buildBreadcrumb(sections, numericSectionId);

    let aggregatedCases = [];
    for (const secId of sectionIds) {
        const sectionCases = await getCases(projectId, suiteId, { section_id: secId });
        aggregatedCases = aggregatedCases.concat(sectionCases);
    }

    return { cases: aggregatedCases, sectionName };
};

/**
 * Builds the Slack payload with the given summary and metrics.
 */
const buildSlackPayload = (sectionName, summary, metrics) => {
    const color = getColorForCoverage(metrics.automationCoverage);
    const currentTime = new Date().toLocaleString();
    const sectionDisplayName = sectionName || "All Sections";

    const fields = [
        { type: "mrkdwn", text: `*Total Cases:*\n${summary.total}` },
        { type: "mrkdwn", text: `*Automated:*\n${summary["Automated"]}` },
        { type: "mrkdwn", text: `*Can be Automated:*\n${summary["Can be Automated"]}` },
        { type: "mrkdwn", text: `*Partially Automated:*\n${summary["Partially Automated"]}` },
        { type: "mrkdwn", text: `*Manual:*\n${summary["Manual"]}` },
        { type: "mrkdwn", text: `*Cannot be Automated:*\n${summary["Cannot be Automated"]}` }
    ];

    const blocks = [
        {
            type: "header",
            text: {
                type: "plain_text",
                text: `TestRail Summary Report\n\n\n📂 ${sectionDisplayName}`,
                emoji: true
            }
        },
        {
            type: "section",
            fields
        },
        { type: "divider" },
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text:
                    `*Automation Coverage:* ${metrics.automationCoverage}%\n` +
                    `*Remains to be Automated:* ${metrics.remainsToBeAutomated}%\n` +
                    `*Manual Only:* ${metrics.manualOnly}%`
            }
        },
        {
            type: "context",
            elements: [{ type: "mrkdwn", text: `Report generated: ${currentTime}` }]
        }
    ];

    return { attachments: [{ color, blocks }] };
};

/**
 * Main function: runs the single-section report.
 */
export const run = async (sectionIdFromArgOrImport = null) => {
    const { cases, sectionName } = await fetchRelevantTestCases(sectionIdFromArgOrImport);

    if (!cases?.length) {
        EC.logRed("No test cases retrieved from TestRail for the specified criteria.");
        return;
    }

    const summary = summarizeAutomation(cases);
    const metrics = computeMetrics(summary);
    const slackPayload = buildSlackPayload(sectionName, summary, metrics);

    await sendToSlack(slackWebhookUrl, slackPayload);
};

if (process.argv[1].endsWith("single-section-report.js")) {
    const sectionArg = process.argv.find((arg) => arg.startsWith("--section="));
    const sectionId = sectionArg ? sectionArg.split("=")[1] : null;
    run(sectionId);
}
