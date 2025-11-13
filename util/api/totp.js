import { authenticator } from "otplib";

/**
 * Utility functions for TOTP (Time-based One-Time Password) operations
 */

/**
 * Generates a TOTP code from a secret key
 * @param {string} secret - The TOTP secret key
 * @returns {string} The 6-digit TOTP code
 * @example
 * const code = generateTOTPCode('JBSWY3DPEHPK3PXP');
 * console.log(code); // '123456'
 */
export function generateTOTPCode(secret) {
    return authenticator.generate(secret);
}

/**
 * Verifies a TOTP code against a secret key
 * @param {string} code - The TOTP code to verify
 * @param {string} secret - The TOTP secret key
 * @returns {boolean} True if the code is valid
 * @example
 * const isValid = verifyTOTPCode('123456', 'JBSWY3DPEHPK3PXP');
 * console.log(isValid); // true or false
 */
export function verifyTOTPCode(code, secret) {
    return authenticator.verify({ token: code, secret });
}
