/**
 * Application version
 * This file exports the version from package.json
 * to avoid bundling the entire package.json file
 */

import packageJson from '../../package.json';

export const APP_VERSION = packageJson.version;
export const APP_NAME = 'Cho Training';
