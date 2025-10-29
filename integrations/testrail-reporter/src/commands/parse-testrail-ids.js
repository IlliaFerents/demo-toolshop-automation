import fs from "node:fs";
import EC from "eight-colors";
import path from "path";
import { testrailRegex, testrailObjectRegex } from "../../constants/constants.js";

/**
 * Recursively scans a directory and returns an array of paths for all .js files.
 * Excludes the f5Redirects folder from analysis.
 * @param {string} dir - The directory to scan.
 * @returns {Array<string>} - Array of file paths.
 */
export const getTestFiles = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat?.isDirectory()) {
            // Exclude f5Redirects folder from analysis
            if (file.toLowerCase() !== "f5redirects") {
                results = results.concat(getTestFiles(filePath));
            }
        } else if (filePath.endsWith(".js")) {
            results.push(filePath);
        }
    });
    return results;
};

/**
 * Parses a given file to extract TestRail IDs and returns an array of records.
 * @param {string} filePath - The file to parse.
 * @returns {Array<Object>} - Array of records with file, line, testrailId, text.
 */
export const parseTestRailIdsFromFile = (filePath) => {
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split(/\r?\n/);
    const results = [];

    lines.forEach((line, index) => {
        // Format 1: @testrail 123 (comment-based)
        const commentMatch = line.match(testrailRegex);
        if (commentMatch) {
            results.push({
                file: filePath,
                line: index + 1,
                testrailId: commentMatch[1],
                text: line.trim(),
                format: "comment"
            });
        }

        // Format 2: testrail: "123" (object property)
        let objectMatch;
        while ((objectMatch = testrailObjectRegex.exec(line)) !== null) {
            results.push({
                file: filePath,
                line: index + 1,
                testrailId: objectMatch[1],
                text: line.trim(),
                format: "object"
            });
        }
    });

    return results;
};

/**
 * Parses all JavaScript test files within the given directory to extract TestRail IDs.
 * @param {string} testsDir - The root tests directory.
 * @returns {Array<Object>} - Combined list of TestRail ID records.
 */
export const parseAllTestRailIds = (testsDir) => {
    const files = getTestFiles(testsDir);
    let allMatches = [];
    files.forEach((file) => {
        const matches = parseTestRailIdsFromFile(file);
        if (matches.length > 0) {
            allMatches = allMatches.concat(matches);
        }
    });
    EC.logBlue(`🧪 Found ${allMatches.length} TestRail ID annotations across ${files.length} test files.`);
    return allMatches;
};
