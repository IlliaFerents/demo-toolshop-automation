#!/usr/bin/env node

/**
 * Generates manifest.json from Playwright test report data
 * Manages historical reports and cleanup
 */

const fs = require("fs");
const path = require("path");

const MAX_REPORTS = 15;
const REPORT_DATA_PATH = process.argv[2] || "playwright-report/data.json";
const OUTPUT_DIR = process.argv[3] || "deploy";
const RUN_NUMBER = process.env.GITHUB_RUN_NUMBER || Date.now().toString();
const RUN_ID = process.env.GITHUB_RUN_ID || "local";
const REPO = process.env.GITHUB_REPOSITORY || "demo-toolshop-automation";
const SHA = process.env.GITHUB_SHA ? process.env.GITHUB_SHA.substring(0, 7) : "unknown";

function extractStats(reportData) {
    const stats = reportData.stats || {};
    const suites = reportData.suites || [];

    // Calculate totals
    const total = stats.expected || 0;
    const passed = (stats.expected || 0) - (stats.unexpected || 0) - (stats.flaky || 0);
    const failed = stats.unexpected || 0;
    const flaky = stats.flaky || 0;
    const skipped = stats.skipped || 0;

    // Calculate duration
    let duration = 0;
    function sumDuration(suite) {
        if (suite.specs) {
            suite.specs.forEach((spec) => {
                if (spec.tests) {
                    spec.tests.forEach((test) => {
                        if (test.results) {
                            test.results.forEach((result) => {
                                duration += result.duration || 0;
                            });
                        }
                    });
                }
            });
        }
        if (suite.suites) {
            suite.suites.forEach(sumDuration);
        }
    }
    suites.forEach(sumDuration);

    return {
        total,
        passed,
        failed,
        flaky,
        skipped,
        duration: Math.round(duration / 1000), // Convert to seconds
        passRate: total > 0 ? Math.round((passed / total) * 100) : 0
    };
}

function loadExistingManifest() {
    const manifestPath = path.join(OUTPUT_DIR, "reports", "manifest.json");
    if (fs.existsSync(manifestPath)) {
        try {
            return JSON.parse(fs.readFileSync(manifestPath, "utf8"));
        } catch (e) {
            console.warn("Failed to load existing manifest:", e.message);
        }
    }
    return { reports: [] };
}

function main() {
    // Read Playwright report data
    if (!fs.existsSync(REPORT_DATA_PATH)) {
        console.error(`Report data not found at ${REPORT_DATA_PATH}`);
        process.exit(1);
    }

    const reportData = JSON.parse(fs.readFileSync(REPORT_DATA_PATH, "utf8"));
    const stats = extractStats(reportData);

    // Load existing manifest
    const manifest = loadExistingManifest();

    // Create new report entry
    const newReport = {
        runNumber: parseInt(RUN_NUMBER),
        runId: RUN_ID,
        sha: SHA,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        }),
        time: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit"
        }),
        url: `reports/run-${RUN_NUMBER}/`,
        stats
    };

    // Add to reports array (newest first)
    manifest.reports = [newReport, ...manifest.reports];

    // Keep only last MAX_REPORTS
    if (manifest.reports.length > MAX_REPORTS) {
        const removed = manifest.reports.splice(MAX_REPORTS);
        console.log(`Removed ${removed.length} old report(s) from manifest`);

        // Log which runs will be deleted
        removed.forEach((report) => {
            console.log(`  - Run #${report.runNumber} from ${report.date}`);
        });
    }

    // Update summary stats
    manifest.latest = newReport;
    manifest.updatedAt = new Date().toISOString();

    // Calculate trends (compare with previous run)
    if (manifest.reports.length > 1) {
        const prev = manifest.reports[1];
        manifest.trends = {
            passRate: stats.passRate - prev.stats.passRate,
            total: stats.total - prev.stats.total
        };
    }

    // Ensure output directory exists
    const reportsDir = path.join(OUTPUT_DIR, "reports");
    if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
    }

    // Write manifest
    const manifestPath = path.join(reportsDir, "manifest.json");
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

    console.log(`✓ Manifest generated with ${manifest.reports.length} report(s)`);
    console.log(`✓ Latest run #${RUN_NUMBER}: ${stats.passed}/${stats.total} passed (${stats.passRate}%)`);
}

main();
