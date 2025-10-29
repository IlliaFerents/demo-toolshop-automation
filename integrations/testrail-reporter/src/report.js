import { getCases } from "./client.js";

export const automationMapping = {
    0: "Automated",
    1: "Partially Automated",
    2: "Can be Automated",
    3: "Manual",
    4: "Cannot be Automated"
};

/**
 * Recursively finds all section IDs (including the parent) for a given parentSectionId.
 * @param {Array} sections - Array of section objects.
 * @param {number} parentSectionId
 * @returns {Array} List of section IDs.
 */
export const getChildSectionIds = (sections, parentSectionId) => {
    const ids = [parentSectionId];
    const findChildren = (pid) => {
        sections.forEach((sec) => {
            if (sec.parent_id === pid) {
                ids.push(sec.id);
                findChildren(sec.id);
            }
        });
    };
    findChildren(parentSectionId);
    return ids;
};

/**
 * Aggregates test cases by custom_automation_type.
 * @param {Array} cases - Array of test case objects.
 * @returns {Object} Summary object with counts per category and total.
 */
export const summarizeAutomation = (cases) => {
    const summary = {};
    Object.values(automationMapping).forEach((label) => {
        summary[label] = 0;
    });
    cases.forEach((tc) => {
        const key = tc.custom_automation_type;
        const label = automationMapping[key] || "Unknown";
        summary[label] = (summary[label] || 0) + 1;
    });
    summary.total = cases?.length || 0;
    return summary;
};

/**
 * Computes additional metrics.
 */
export const computeMetrics = (summary) => {
    const automationCoverage = ((summary["Automated"] / summary.total) * 100).toFixed(2);
    const remainsToBeAutomated = ((summary["Can be Automated"] / summary.total) * 100).toFixed(2);
    const manualOnlyCount = (summary["Manual"] || 0) + (summary["Cannot be Automated"] || 0);
    const manualOnly = ((manualOnlyCount / summary.total) * 100).toFixed(2);
    return { automationCoverage, remainsToBeAutomated, manualOnly };
};

/**
 * Builds a plain text report.
 * @param {string} sectionName - Name of the section, if applicable.
 * @param {Object} summary - The summary data.
 * @returns {string} A formatted report text.
 */
export const buildReportText = (sectionName, summary) => {
    const { automationCoverage, remainsToBeAutomated, manualOnly } = computeMetrics(summary);
    let msg = `*TestRail Automation Report*\n`;
    if (sectionName) {
        msg += `*Section:* ${sectionName}\n`;
    }
    msg += `Total Cases: ${summary.total}\n`;
    Object.keys(automationMapping).forEach((key) => {
        const label = automationMapping[key];
        const count = summary[label] || 0;
        msg += `${label} Cases: ${count}\n`;
    });
    msg += "---------------------------------\n";
    msg += `*Automation Coverage:* ${automationCoverage}%\n`;
    msg += `*Remains to be Automated:* ${remainsToBeAutomated}%\n`;
    msg += `*Manual Only:* ${manualOnly}%\n`;
    return msg;
};

/**
 * Builds a map of { sectionId: [caseId, ...] } from all cases in the suite.
 * @param {number} projectId
 * @param {number} suiteId
 * @returns {Promise<Object>} Map of section IDs to their test cases.
 */
export const buildSectionToCaseMap = async (projectId, suiteId) => {
    const cases = await getCases(projectId, suiteId);
    const map = {};

    for (const tc of cases) {
        if (tc.id && tc.section_id) {
            if (!map[tc.section_id]) {
                map[tc.section_id] = [];
            }
            map[tc.section_id].push(tc.id);
        }
    }
    return map;
};
