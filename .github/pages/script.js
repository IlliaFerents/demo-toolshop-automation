// Placeholder for future dynamic functionality
// This will be expanded when we add the dashboard features

document.addEventListener("DOMContentLoaded", () => {
    loadTestStats();
    loadRecentReports();
});

async function loadTestStats() {
    try {
        // Try to fetch test stats from the latest report
        const response = await fetch("reports/latest/data.json");
        if (response.ok) {
            const data = await response.json();
            updateStats(data);
        } else {
            // Default values when no report exists yet
            setDefaultStats();
        }
    } catch (error) {
        console.log("No stats available yet:", error);
        setDefaultStats();
    }
}

function updateStats(data) {
    const totalTests = data.stats?.expected || 0;
    const passed = data.stats?.expected - data.stats?.unexpected || 0;
    const failed = data.stats?.unexpected || 0;

    document.getElementById("total-tests").textContent = totalTests;

    const lastRun = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
    document.getElementById("last-run").textContent = lastRun;

    const status = failed === 0 ? "✓ Passing" : `✗ ${failed} Failed`;
    const statusElement = document.getElementById("test-status");
    statusElement.textContent = status;
    statusElement.style.color = failed === 0 ? "var(--pw-green)" : "var(--pw-red)";
}

function setDefaultStats() {
    document.getElementById("total-tests").textContent = "--";
    document.getElementById("last-run").textContent = "Not yet run";
    document.getElementById("test-status").textContent = "Pending";
}

async function loadRecentReports() {
    try {
        // Try to fetch reports manifest
        const response = await fetch("reports/manifest.json");
        if (response.ok) {
            const reports = await response.json();
            displayReports(reports);
        }
    } catch (error) {
        console.log("No reports manifest available yet:", error);
        // Keep the default placeholder
    }
}

function displayReports(reports) {
    const reportsList = document.getElementById("reports-list");

    if (!reports || reports.length === 0) {
        return;
    }

    reportsList.innerHTML = reports
        .slice(0, 5)
        .map(
            (report) => `
        <div class="report-item">
            <div class="report-info">
                <h3 class="report-title">${report.title}</h3>
                <p class="report-meta">
                    ${report.date} • ${report.tests} tests
                    ${report.status ? `• <span class="report-status ${report.status}">${report.status}</span>` : ""}
                </p>
            </div>
            <a href="${report.url}" class="btn btn-small">View Report</a>
        </div>
    `
        )
        .join("");
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
