import { IncomingWebhook } from "@slack/webhook";
import EC from "eight-colors";
import { TestRailReporterColors } from "../constants/constants.js";

/**
 * Determines the color for the attachment based on automation coverage.
 * @param {string} coverage - Automation coverage percentage.
 * @returns {string} Hex color code.
 */
export const getColorForCoverage = (coverage) => {
    const cov = parseFloat(coverage);
    if (cov >= 80) {
        return TestRailReporterColors.green;
    } else if (cov >= 50) {
        return TestRailReporterColors.orange;
    } else {
        return TestRailReporterColors.red;
    }
};

/**
 * Sends a Slack message using the provided webhook URL and payload.
 * @param {string} slackWebhookUrl - The Slack webhook URL.
 * @param {Object} payload - Slack payload in Block Kit format.
 */
export const sendToSlack = async (slackWebhookUrl, payload) => {
    const webhook = new IncomingWebhook(slackWebhookUrl);
    try {
        await webhook.send(payload);
        EC.logGreen("Slack message posted successfully.");
    } catch (error) {
        EC.logRed("Error posting message to Slack:", error);
    }
};
