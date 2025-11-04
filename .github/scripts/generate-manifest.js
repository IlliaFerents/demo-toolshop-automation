#!/usr/bin/env node

/**
 * Generates manifest.json from Playwright test report data
 * Manages historical reports and cleanup
 */

const fs = require("node:fs");
const path = require("path");

const MAX_REPORTS = 15;
const REPORT_DIR = process.argv[2] || "playwright-report";
const OUTPUT_DIR = process.argv[3] || "deploy";
const REPORT_JSON = path.join(REPORT_DIR, "results.json");
const RUN_NUMBER = process.env.GITHUB_RUN_NUMBER || Date.now().toString();
const RUN_ID = process.env.GITHUB_RUN_ID || "local";
const SHA = process.env.GITHUB_SHA ? process.env.GITHUB_SHA.substring(0, 7) : "unknown";

function extractStats(reportData) {
    const stats = reportData.stats || {};

    // Calculate totals from stats
    const total = stats.expected || 0;
    const passed = (stats.expected || 0) - (stats.unexpected || 0) - (stats.flaky || 0);
    const failed = stats.unexpected || 0;
    const flaky = stats.flaky || 0;
    const skipped = stats.skipped || 0;
    const duration = Math.round((stats.duration || 0) / 1000); // Convert ms to seconds

    return {
        total,
        passed,
        failed,
        flaky,
        skipped,
        duration,
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
    if (!fs.existsSync(REPORT_JSON)) {
        console.warn(`Report not found at ${REPORT_JSON}. Creating placeholder manifest.`);
        createPlaceholderManifest();
        return;
    }

    let reportData;
    try {
        reportData = JSON.parse(fs.readFileSync(REPORT_JSON, "utf8"));
    } catch (e) {
        console.warn(`Failed to parse report: ${e.message}. Creating placeholder manifest.`);
        createPlaceholderManifest();
        return;
    }

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

function createPlaceholderManifest() {
    const manifest = loadExistingManifest();

    const stats = {
        total: 0,
        passed: 0,
        failed: 0,
        flaky: 0,
        skipped: 0,
        duration: 0,
        passRate: 0
    };

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

    manifest.reports = [newReport, ...manifest.reports];
    manifest.latest = newReport;
    manifest.updatedAt = new Date().toISOString();

    const reportsDir = path.join(OUTPUT_DIR, "reports");
    if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
    }

    const manifestPath = path.join(reportsDir, "manifest.json");
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

    console.log(`✓ Placeholder manifest created for run #${RUN_NUMBER}`);
}

main();
