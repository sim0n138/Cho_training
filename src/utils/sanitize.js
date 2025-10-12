/**
 * Utility functions for sanitizing user input to prevent XSS attacks
 */

/**
 * Sanitizes a string by removing potentially dangerous HTML tags and scripts
 * @param {string} str - String to sanitize
 * @param {number} maxLength - Maximum allowed length (default: 1000)
 * @returns {string} - Sanitized string
 */
export const sanitizeString = (str, maxLength = 1000) => {
  if (typeof str !== 'string') {
    return '';
  }

  // Remove HTML tags and script content
  let sanitized = str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');

  // Trim whitespace
  sanitized = sanitized.trim();

  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.slice(0, maxLength);
  }

  return sanitized;
};

/**
 * Sanitizes HTML entities to prevent XSS
 * @param {string} str - String to sanitize
 * @returns {string} - String with HTML entities escaped
 */
export const escapeHtml = (str) => {
  if (typeof str !== 'string') {
    return '';
  }

  const htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return str.replace(/[&<>"'/]/g, (char) => htmlEntities[char]);
};

/**
 * Validates and sanitizes a JSON string
 * @param {string} jsonString - JSON string to validate
 * @returns {Object} - Object with isValid flag and sanitized data or error
 */
export const sanitizeJSON = (jsonString) => {
  if (typeof jsonString !== 'string') {
    return {
      isValid: false,
      error: 'Input must be a string',
    };
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /<script/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /eval\(/gi,
    /Function\(/gi,
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(jsonString)) {
      return {
        isValid: false,
        error: 'JSON contains potentially malicious content',
      };
    }
  }

  try {
    const parsed = JSON.parse(jsonString);
    return {
      isValid: true,
      data: parsed,
    };
  } catch {
    return {
      isValid: false,
      error: 'Invalid JSON format',
    };
  }
};

/**
 * Sanitizes an object by sanitizing all string values
 * @param {Object} obj - Object to sanitize
 * @param {number} maxLength - Maximum string length
 * @returns {Object} - Sanitized object
 */
export const sanitizeObject = (obj, maxLength = 1000) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => {
      if (typeof item === 'string') {
        return sanitizeString(item, maxLength);
      }
      return sanitizeObject(item, maxLength);
    });
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value, maxLength);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value, maxLength);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

const sanitize = {
  sanitizeString,
  escapeHtml,
  sanitizeJSON,
  sanitizeObject,
};

export default sanitize;
