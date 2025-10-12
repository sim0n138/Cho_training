/**
 * Application version and display name constants
 *
 * This file exports minimal metadata from package.json
 * to avoid bundling the entire package.json file.
 *
 * Note: APP_NAME is the user-facing display name "Cho Training",
 * while package.json "name" field is "cho_training" (lowercase with underscore)
 * which is the technical npm package name. These are intentionally different.
 */

import packageJson from '../../package.json';

export const APP_VERSION = packageJson.version;
export const APP_NAME = 'Cho Training';
