document.addEventListener("DOMContentLoaded", () => {
    loadManifest();
});

async function loadManifest() {
    try {
        const response = await fetch("reports/manifest.json");
        if (response.ok) {
            const manifest = await response.json();
            updateStats(manifest.latest);
            displayReports(manifest.reports);
            displayTrends(manifest.reports);
            displayPassRateTrend(manifest.reports);
        } else {
            setDefaultStats();
        }
    } catch (error) {
        console.log("No manifest available yet:", error);
        setDefaultStats();
    }
}

function updateStats(latest) {
    if (!latest) {
        setDefaultStats();
        return;
    }

    const { stats, date, time } = latest;

    document.getElementById("total-tests").textContent = stats.total;
    document.getElementById("last-run").textContent = `${date} ${time}`;

    const statusText = stats.failed === 0 ? "✓ Passing" : `✗ ${stats.failed} Failed`;
    const statusElement = document.getElementById("test-status");
    statusElement.textContent = statusText;
    statusElement.style.color = stats.failed === 0 ? "var(--pw-green)" : "var(--pw-red)";
}

function setDefaultStats() {
    document.getElementById("total-tests").textContent = "--";
    document.getElementById("last-run").textContent = "Not yet run";
    document.getElementById("test-status").textContent = "Pending";
}

function displayReports(reports) {
    if (!reports || reports.length === 0) return;

    const reportsList = document.getElementById("reports-list");
    reportsList.innerHTML = reports
        .slice(0, 5)
        .map((report) => {
            const { stats, date, time, url, runNumber } = report;
            const statusClass = stats.failed === 0 ? "passed" : "failed";
            const statusText = stats.failed === 0 ? "Passed" : "Failed";

            return `
            <div class="report-item">
                <div class="report-info">
                    <h3 class="report-title">Run #${runNumber}</h3>
                    <p class="report-meta">
                        ${date} at ${time} • ${stats.passed}/${stats.total} passed
                        ${stats.flaky > 0 ? `• ${stats.flaky} flaky` : ""}
                        • <span class="report-status ${statusClass}">${statusText}</span>
                    </p>
                </div>
                <a href="${url}" class="btn btn-small">View Report</a>
            </div>
        `;
        })
        .join("");
}

function displayTrends(reports) {
    if (!reports || reports.length < 2) return;

    const trendsContainer = document.getElementById("trends-chart");
    if (!trendsContainer) return;

    // Take last 7 runs (or all if less)
    const recentRuns = reports.slice(0, 7).reverse();
    const maxTotal = Math.max(...recentRuns.map((r) => Number(r.stats.total) || 0));

    if (!Number.isFinite(maxTotal) || maxTotal <= 0) {
        trendsContainer.innerHTML = `<p class="trends-placeholder">No test volume data yet</p>`;
        return;
    }

    trendsContainer.innerHTML = `
        <div class="trends-chart-container">
            <div class="y-axis-label">Tests</div>
            <div class="trends-bars">
                ${recentRuns
                    .map((report) => {
                        const passHeight = (report.stats.passed / maxTotal) * 100;
                        const failHeight = (report.stats.failed / maxTotal) * 100;
                        const flakyHeight = (report.stats.flaky / maxTotal) * 100;

                        const tooltip =
                            [
                                report.stats.passed > 0 ? `${report.stats.passed} passed` : null,
                                report.stats.failed > 0 ? `${report.stats.failed} failed` : null,
                                report.stats.flaky > 0 ? `${report.stats.flaky} flaky` : null
                            ]
                                .filter(Boolean)
                                .join(", ") || "0 tests";

                        return `
                        <div class="trend-bar-wrapper">
                            <div class="trend-bar" title="${tooltip}">
                                <div class="bar-segment bar-passed" style="height: ${passHeight}%"></div>
                                <div class="bar-segment bar-failed" style="height: ${failHeight}%"></div>
                                <div class="bar-segment bar-flaky" style="height: ${flakyHeight}%"></div>
                            </div>
                            <div class="trend-label">#${report.runNumber}</div>
                        </div>
                    `;
                    })
                    .join("")}
            </div>
        </div>
        <div class="trends-legend">
            <span class="legend-item"><span class="legend-dot passed"></span>Passed</span>
            <span class="legend-item"><span class="legend-dot failed"></span>Failed</span>
            <span class="legend-item"><span class="legend-dot flaky"></span>Flaky</span>
        </div>
    `;
}

function displayPassRateTrend(reports) {
    if (!reports || reports.length < 2) return;

    const passRateContainer = document.getElementById("pass-rate-chart");
    if (!passRateContainer) return;

    // Take last 7 runs (or all if less)
    const recentRuns = reports.slice(0, 7).reverse();

    const chartHTML = `
        <div class="pass-rate-chart-container">
            <div class="y-axis-label">Pass Rate %</div>
            <div class="pass-rate-chart">
                <div class="pass-rate-grid">
                    <div class="pass-rate-gridlines">
                        <div class="gridline"><span class="gridline-label">100%</span></div>
                        <div class="gridline"><span class="gridline-label">75%</span></div>
                        <div class="gridline"><span class="gridline-label">50%</span></div>
                        <div class="gridline"><span class="gridline-label">25%</span></div>
                        <div class="gridline"><span class="gridline-label">0%</span></div>
                    </div>
                    <div class="pass-rate-line">
                        ${recentRuns
                            .map((report, index) => {
                                const passRate = report.stats.passRate || 0;
                                const bottomPercent = passRate;
                                const tooltip = `Run #${report.runNumber}: ${passRate}% (${report.stats.passed}/${report.stats.total})`;
                                const pointClass = passRate < 80 ? "rate-point low" : "rate-point";

                                // Calculate line to next point
                                let lineHTML = "";
                                if (index < recentRuns.length - 1) {
                                    const nextReport = recentRuns[index + 1];
                                    const nextPassRate = nextReport.stats.passRate || 0;
                                    const deltaY = nextPassRate - passRate;
                                    const deltaX = 100 / (recentRuns.length - 1); // percentage of container width

                                    // Calculate angle and length
                                    const angle = Math.atan2(deltaY, deltaX * 1.6); // 1.6 is aspect ratio adjustment
                                    const length = Math.sqrt(Math.pow(deltaX * 1.6, 2) + Math.pow(deltaY, 2));

                                    lineHTML = `
                                        <div class="rate-line-segment" style="
                                            width: ${length}%;
                                            bottom: ${bottomPercent}%;
                                            left: 50%;
                                            transform: rotate(${angle}rad);
                                        "></div>
                                    `;
                                }

                                return `
                                    <div class="rate-point-wrapper">
                                        <div class="${pointClass}" 
                                             style="bottom: ${bottomPercent}%;" 
                                             title="${tooltip}">
                                        </div>
                                        ${lineHTML}
                                        <div class="rate-label">#${report.runNumber}</div>
                                    </div>
                                `;
                            })
                            .join("")}
                    </div>
                </div>
            </div>
        </div>
    `;

    passRateContainer.innerHTML = chartHTML;
}

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
});
