import Testrail from "testrail-api";
import EC from "eight-colors";
import { config } from "../config.js";

const options = {
    host: config.host,
    user: config.user,
    password: config.password
};

// Create a TestRail API client instance.
const client = (() => {
    const testrailApi = new Testrail(options);
    return {
        async request() {
            const args = Array.from(arguments);
            const methodName = args.shift();
            const method = testrailApi[methodName];
            let error = null;
            const res = await method.apply(testrailApi, args).catch((e) => (error = e));
            if (error) {
                EC.logRed(`[TestRail] Error during ${methodName}`);
                EC.logRed(error.message?.error);
                return null;
            }
            return res.body;
        }
    };
})();

const PAGE_LIMIT = 250; // TestRail API limitation for cases and sections in one request

/**
 * Generic paginator for any TestRail API method that returns `items` in pages.
 * @param {string} methodName  - e.g. "getSections" or "getCases"
 * @param {number} projectId
 * @param {Object} baseParams  - the params common to every request, e.g. suite_id or section_id
 * @param {string} itemsKey    - the key in the response that holds the array, e.g. "sections" or "cases"
 */
async function paginate(methodName, projectId, baseParams, itemsKey) {
    let allItems = [];
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
        const params = { limit: PAGE_LIMIT, offset, ...baseParams };
        const response = await client.request(methodName, projectId, params);

        const items =
            response && Array.isArray(response[itemsKey])
                ? response[itemsKey]
                : Array.isArray(response)
                  ? response
                  : [];

        allItems = [...allItems, ...items];

        if (items.length < PAGE_LIMIT) {
            hasMore = false;
        } else {
            offset += PAGE_LIMIT;
        }
    }

    return allItems;
}

/**
 * Retrieves all sections for a given suite in the project, across all pages.
 * @param {number} projectId
 * @param {number} suiteId
 */
export const getSections = (projectId, suiteId) => {
    return paginate("getSections", projectId, { suite_id: suiteId }, "sections");
};

/**
 * Retrieves all test cases for a given project, suite, and filter parameters by paginating.
 *
 * @param {number} projectId
 * @param {number} suiteId
 * @param {Object} params - Additional parameters (like section_id).
 */
export const getCases = (projectId, suiteId, params = {}) => {
    return paginate("getCases", projectId, { suite_id: suiteId, ...params }, "cases");
};

export default client;
