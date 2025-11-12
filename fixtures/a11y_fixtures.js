import { AxeBuilder } from "@axe-core/playwright";
import { AccessibilityUtil } from "../util/browser/accessibility";

/**
 * Accessibility axe-core config for WCAG 2.0, 2.1, and 2.2 Level A and AA compliance
 * plus selected best practice rules.
 *
 * Tests against WCAG standards including:
 * - WCAG 2.0 Level A and AA
 * - WCAG 2.1 Level A and AA
 * - WCAG 2.2 Level AA
 *
 * Additional best practice rules:
 * - tabindex: https://dequeuniversity.com/rules/axe/4.2/tabindex
 * - heading-order: https://dequeuniversity.com/rules/axe/4.2/heading-order
 * - page-has-heading-one: https://dequeuniversity.com/rules/axe/4.2/page-has-heading-one
 *
 * Excludes navigation and footer regions by default.
 */

const a11yFixtures = {
    a11y: async ({ page }, use) => {
        const a11yWrapper = {
            analyze: async (options = {}) => {
                const processedOptions = { ...options };

                if (options.include) {
                    processedOptions.include = await Promise.all(
                        options.include.map(AccessibilityUtil.extractSelector)
                    );
                }

                if (options.exclude) {
                    processedOptions.exclude = await Promise.all(
                        options.exclude.map(AccessibilityUtil.extractSelector)
                    );
                }

                const defaultExcludes = ["#nav", "#FooterRegion"];
                const allExcludes = [...defaultExcludes, ...(processedOptions.exclude || [])];

                // Run WCAG scan
                const wcagBuilder = new AxeBuilder({ page });
                const wcagOptions = {
                    tags: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"],
                    exclude: allExcludes,
                    include: processedOptions.include || []
                };
                const wcagResults = await AccessibilityUtil.analyzeWithOptions(wcagBuilder, wcagOptions);

                // Run best practice rules scan
                const bpBuilder = new AxeBuilder({ page });
                const bpOptions = {
                    rules: ["tabindex", "heading-order", "page-has-heading-one"],
                    exclude: allExcludes,
                    include: processedOptions.include || []
                };
                const bpResults = await AccessibilityUtil.analyzeWithOptions(bpBuilder, bpOptions);

                // Merge violations, avoiding duplicates
                const allViolations = [...wcagResults.violations];
                const wcagRuleIds = new Set(wcagResults.violations.map((v) => v.id));

                bpResults.violations.forEach((violation) => {
                    if (!wcagRuleIds.has(violation.id)) {
                        allViolations.push(violation);
                    }
                });

                return {
                    ...wcagResults,
                    violations: allViolations
                };
            },
            assertNoViolations: (results) => {
                if (results.violations.length > 0) {
                    const summary =
                        `Expected 0 violations, received ${results.violations.length}:\n` +
                        results.violations.map((v) => `  • ${v.id} (${v.impact})`).join("\n");
                    throw new Error(summary);
                }
            }
        };

        await use(a11yWrapper);
    }
};

export default a11yFixtures;
