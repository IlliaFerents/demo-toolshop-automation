/**
 * Product category constants
 */
export const CATEGORIES = {
    HAND_TOOLS: {
        name: "Hand Tools",
        subCategories: ["Hammer", "Hand Saw", "Wrench", "Screwdriver", "Pliers", "Chisels", "Measures"]
    },
    POWER_TOOLS: {
        name: "Power Tools",
        subCategories: ["Grinder", "Sander", "Saw", "Drill"]
    },
    OTHER: {
        name: "Other",
        subCategories: ["Tool Belts", "Storage Solutions", "Workbench", "Safety Gear", "Fasteners"]
    }
};

/**
 * Get all subcategories from Hand Tools and Power Tools
 * @returns {string[]} Array of all subcategory names
 */
export function getAllSubCategories() {
    return [...CATEGORIES.HAND_TOOLS.subCategories, ...CATEGORIES.POWER_TOOLS.subCategories];
}
