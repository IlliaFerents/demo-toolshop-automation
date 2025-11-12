import logger from "../logger/logger.js";

/**
 * Simplified accessibility testing utility
 */
class AccessibilityUtil {
    /**
     * Extracts a CSS selector from a Playwright locator or returns the string as-is.
     * Works with all Playwright locator methods: getByTestId, getByRole, getByText,
     * getByLabel, locator, etc.
     * @param {string|Locator} item - String selector or Playwright locator
     * @returns {Promise<string>} CSS selector string
     */
    static async extractSelector(item) {
        if (typeof item === "string") return item;

        if (item && typeof item === "object" && typeof item.evaluate === "function") {
            try {
                const selector = await item.evaluate((el) => {
                    if (el.id) return `#${el.id}`;

                    const testId = el.getAttribute("data-testid");
                    if (testId) return `[data-testid="${testId}"]`;

                    if (el.className && typeof el.className === "string") {
                        const classes = el.className.trim().split(/\s+/);
                        if (classes.length > 0 && classes[0]) {
                            return `.${classes[0]}`;
                        }
                    }

                    return el.tagName.toLowerCase();
                });
                return selector;
            } catch (error) {
                logger.log("warn", `Failed to extract selector from locator: ${error.message}`);
                return "body";
            }
        }

        return item;
    }

    /**
     * Analyze accessibility with custom logging. Returns results for caller to evaluate.
     * @param {AxeBuilder} axeBuilder - The axe builder instance
     * @param {Object} options - Configuration options
     * @param {string[]} options.tags - WCAG tags to test against
     * @param {string[]} options.rules - Specific rules to test
     * @param {string[]} options.include - Selectors to include
     * @param {string[]} options.exclude - Selectors to exclude
     * @returns {Promise<Object>} Accessibility scan results
     */
    static async analyzeWithOptions(axeBuilder, options = {}) {
        const { tags = ["wcag2a", "wcag2aa"], rules = [], include = [], exclude = [] } = options;

        // Configure axe builder
        let builder = axeBuilder.withTags(tags);

        if (rules.length > 0) {
            builder = builder.withRules(rules);
        }

        include.forEach((selector) => {
            builder = builder.include(selector);
        });

        exclude.forEach((selector) => {
            builder = builder.exclude(selector);
        });

        // Run analysis
        const results = await builder.analyze();

        // Log violations if any found
        if (results.violations.length > 0) {
            logger.log("error", `🚨 Found ${results.violations.length} accessibility violations:`);

            results.violations.forEach((violation, index) => {
                logger.log("error", `${index + 1}. Rule: ${violation.id}`);
                logger.log("warn", `   Impact: ${violation.impact.toUpperCase()}`);
                logger.log("info", `   Description: ${violation.description}`);
                logger.log("info", `   Help: ${violation.helpUrl}`);
                logger.log("info", `   Affected elements: ${violation.nodes.length}`);

                // Log first few affected elements
                violation.nodes.slice(0, 3).forEach((node, nodeIndex) => {
                    logger.log("verbose", `   Element ${nodeIndex + 1}: ${node.target.join(", ")}`);
                    if (node.failureSummary) {
                        logger.log("verbose", `     Issue: ${node.failureSummary}`);
                    }
                });

                if (violation.nodes.length > 3) {
                    logger.log("verbose", `   ... and ${violation.nodes.length - 3} more elements`);
                }
            });

            logger.log("info", `📊 Violations by severity:`);
            const bySeverity = results.violations.reduce((acc, v) => {
                acc[v.impact] = (acc[v.impact] || 0) + 1;
                return acc;
            }, {});

            Object.entries(bySeverity).forEach(([severity, count]) => {
                logger.log("warn", `   ${severity}: ${count}`);
            });
        }

        return results;
    }
}

export { AccessibilityUtil };
