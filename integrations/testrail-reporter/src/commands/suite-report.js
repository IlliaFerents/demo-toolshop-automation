import { getSections, getCases } from "../client.js";
import { getChildSectionIds, summarizeAutomation } from "../report.js";
import { sendToSlack, getColorForCoverage } from "../slack.js";
import { config } from "../../config.js";

const { projectId, suiteId, slackWebhookUrl } = config;

/**
 * Fetches section-wise automation summary and prepares raw data for formatting.
 * Returns: Array of { sectionName, total, automated, coverage }
 */
async function fetchCoverageData() {
    const sections = await getSections(projectId, suiteId);
    const cases = await getCases(projectId, suiteId);

    const topSections = sections.filter((sec) => !sec.depth || sec.depth === 0);
    topSections.sort((a, b) => a.display_order - b.display_order);

    const summaryList = [];

    for (const section of topSections) {
        const descendantIds = getChildSectionIds(sections, section.id);
        const sectionCases = cases.filter((tc) => descendantIds.includes(Number(tc.section_id)));

        if (!sectionCases.length) continue;

        const summary = summarizeAutomation(sectionCases);
        const total = summary.total;
        const automated = summary["Automated"] || 0;
        const coverage = total > 0 ? ((automated / total) * 100).toFixed(2) : "N/A";

        summaryList.push({
            sectionName: section.name,
            total,
            automated,
            coverage
        });
    }

    return summaryList;
}

/**
 * Builds the Slack message payload based on coverage summary.
 */
function buildSlackPayload(summaryList) {
    const currentTime = new Date().toLocaleString();

    const attachments = [
        {
            blocks: [
                {
                    type: "header",
                    text: {
                        type: "plain_text",
                        text: "SearchUI TestRail Suite Coverage Report",
                        emoji: true
                    }
                }
            ]
        }
    ];

    summaryList.forEach(({ sectionName, total, automated, coverage }) => {
        attachments.push({
            color: getColorForCoverage(coverage),
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: `*${sectionName}*\nTotal: ${total} | Automated: ${automated} | Coverage: ${coverage}%`
                    }
                },
                { type: "divider" }
            ]
        });
    });

    attachments.push({
        blocks: [
            {
                type: "context",
                elements: [{ type: "mrkdwn", text: `Report generated: ${currentTime}` }]
            }
        ]
    });

    return { attachments };
}

async function run() {
    const summaryList = await fetchCoverageData();
    const slackPayload = buildSlackPayload(summaryList);
    await sendToSlack(slackWebhookUrl, slackPayload);
}

run();
