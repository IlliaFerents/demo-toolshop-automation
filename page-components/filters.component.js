/**
 * @class FiltersComponent
 */
class FiltersComponent {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.filtersContainer = page.getByTestId("filters");
        this.sortDropdown = page.getByTestId("sort");
        this.priceRangeSliderMin = page.getByRole("slider", { name: "ngx-slider" });
        this.priceRangeSliderMax = page.getByRole("slider", { name: "ngx-slider-max" });
        this.searchInput = page.getByTestId("search-query");
        this.searchResetButton = page.getByTestId("search-reset");
        this.searchSubmitButton = page.getByTestId("search-submit");
        this.categoryCheckbox = page.locator('input[name="category_id"]');
        this.brandCheckbox = page.locator('input[name="brand_id"]');
        this.ecoFriendlyCheckbox = page.getByTestId("eco-friendly-filter");
    }

    /**
     * Sorts products by criteria and order
     * @param {string} criteria - Sort criteria: 'name', 'price', or 'co2_rating'
     * @param {string} order - Sort order: 'asc' (ascending) or 'desc' (descending)
     */
    async sortBy(criteria, order) {
        const validCriteria = ["name", "price", "co2_rating"];
        const validOrder = ["asc", "desc"];

        if (!validCriteria.includes(criteria)) {
            throw new Error(`Invalid sort criteria: ${criteria}. Expected one of: ${validCriteria.join(", ")}`);
        }
        if (!validOrder.includes(order)) {
            throw new Error(`Invalid sort order: ${order}. Expected one of: ${validOrder.join(", ")}`);
        }

        const sortValue = `${criteria},${order}`;
        await this.sortDropdown.selectOption(sortValue);
    }

    /**
     * Sets the price range filter
     * @param {number} min - Minimum price
     * @param {number} max - Maximum price
     */
    async selectPriceRange(min, max) {
        await this.priceRangeSliderMin.focus();
        const currentMin = await this.priceRangeSliderMin.getAttribute("aria-valuenow");
        const stepsMin = min - Number(currentMin);
        const keyMin = stepsMin > 0 ? "ArrowRight" : "ArrowLeft";
        for (let i = 0; i < Math.abs(stepsMin); i++) {
            await this.page.keyboard.press(keyMin);
        }

        await this.priceRangeSliderMax.focus();
        const currentMax = await this.priceRangeSliderMax.getAttribute("aria-valuenow");
        const stepsMax = max - Number(currentMax);
        const keyMax = stepsMax > 0 ? "ArrowRight" : "ArrowLeft";
        for (let i = 0; i < Math.abs(stepsMax); i++) {
            await this.page.keyboard.press(keyMax);
        }
    }

    /**
     * Resets the search filter
     */
    async resetSearch() {
        await this.searchResetButton.click();
    }

    /**
     * Submits a search query
     * @param {string} query - The search query to submit
     */
    async submitSearch(query) {
        await this.searchInput.fill(query);
        await this.searchSubmitButton.click();
    }

    /**
     * Selects a category by its visible text
     * @param {string} category - The visible text of the category to select
     */
    async selectCategory(category) {
        await this.categoryCheckbox.filter({ hasText: category }).check();
    }

    /**
     * Selects a brand by its visible text
     * @param {string} brand - The visible text of the brand to select
     */
    async selectBrand(brand) {
        await this.brandCheckbox.filter({ hasText: brand }).check();
    }

    /**
     * Toggles the eco-friendly filter
     * @param {boolean} enable - True to enable, false to disable
     */
    async toggleEcoFriendly(enable) {
        await this.ecoFriendlyCheckbox.setChecked(enable);
    }
}

export default FiltersComponent;
