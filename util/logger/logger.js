import colors from "colors";

colors.setTheme({
    assertion: "cyan",
    verbose: "magenta",
    info: "green",
    warn: "yellow",
    error: "red"
});

const logger = {
    log: (severity, message, args = []) => {
        const severityColor = colors[severity];
        console.log(`${severityColor(`[${severity.toUpperCase()}]`)} ${message}`, ...args);
    }
};

export default logger;
