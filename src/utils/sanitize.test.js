import { describe, it, expect } from 'vitest';
import {
  sanitizeString,
  escapeHtml,
  sanitizeJSON,
  sanitizeObject,
} from './sanitize';

describe('sanitize', () => {
  describe('sanitizeString', () => {
    it('should remove script tags', () => {
      const input = '<script>alert("XSS")</script>Hello';
      const result = sanitizeString(input);
      expect(result).toBe('Hello');
    });

    it('should remove HTML tags', () => {
      const input = '<div><p>Hello</p></div>';
      const result = sanitizeString(input);
      expect(result).toBe('Hello');
    });

    it('should remove javascript: protocol', () => {
      const input = 'javascript:alert("XSS")';
      const result = sanitizeString(input);
      expect(result).toBe('alert("XSS")');
    });

    it('should remove event handlers', () => {
      const input = 'onclick=alert("XSS") Hello';
      const result = sanitizeString(input);
      expect(result).toBe('alert("XSS") Hello');
    });

    it('should trim whitespace', () => {
      const input = '  Hello World  ';
      const result = sanitizeString(input);
      expect(result).toBe('Hello World');
    });

    it('should limit string length', () => {
      const input = 'a'.repeat(2000);
      const result = sanitizeString(input, 100);
      expect(result.length).toBe(100);
    });

    it('should return empty string for non-string input', () => {
      expect(sanitizeString(null)).toBe('');
      expect(sanitizeString(undefined)).toBe('');
      expect(sanitizeString(123)).toBe('');
      expect(sanitizeString({})).toBe('');
    });

    it('should handle valid normal strings', () => {
      const input = 'Привет мир';
      const result = sanitizeString(input);
      expect(result).toBe('Привет мир');
    });
  });

  describe('escapeHtml', () => {
    it('should escape HTML entities', () => {
      const input = '<script>alert("XSS")</script>';
      const result = escapeHtml(input);
      expect(result).toBe(
        '&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;'
      );
    });

    it('should escape ampersands', () => {
      const input = 'Tom & Jerry';
      const result = escapeHtml(input);
      expect(result).toBe('Tom &amp; Jerry');
    });

    it('should escape quotes', () => {
      const input = 'It\'s a "test"';
      const result = escapeHtml(input);
      expect(result).toBe('It&#x27;s a &quot;test&quot;');
    });

    it('should return empty string for non-string input', () => {
      expect(escapeHtml(null)).toBe('');
      expect(escapeHtml(undefined)).toBe('');
      expect(escapeHtml(123)).toBe('');
    });

    it('should handle normal text', () => {
      const input = 'Hello World';
      const result = escapeHtml(input);
      expect(result).toBe('Hello World');
    });
  });

  describe('sanitizeJSON', () => {
    it('should parse valid JSON', () => {
      const input = '{"name": "Test", "value": 123}';
      const result = sanitizeJSON(input);
      expect(result.isValid).toBe(true);
      expect(result.data).toEqual({ name: 'Test', value: 123 });
    });

    it('should reject JSON with script tags', () => {
      const input = '{"name": "<script>alert(\\"XSS\\")</script>"}';
      const result = sanitizeJSON(input);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('malicious');
    });

    it('should reject JSON with javascript: protocol', () => {
      const input = '{"url": "javascript:alert(\\"XSS\\")"}';
      const result = sanitizeJSON(input);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('malicious');
    });

    it('should reject JSON with event handlers', () => {
      const input = '{"handler": "onclick=alert(\\"XSS\\")"}';
      const result = sanitizeJSON(input);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('malicious');
    });

    it('should reject JSON with eval', () => {
      const input = '{"code": "eval(\\"malicious\\")"}';
      const result = sanitizeJSON(input);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('malicious');
    });

    it('should reject invalid JSON', () => {
      const input = '{invalid json}';
      const result = sanitizeJSON(input);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid JSON');
    });

    it('should reject non-string input', () => {
      const result = sanitizeJSON(123);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must be a string');
    });
  });

  describe('sanitizeObject', () => {
    it('should sanitize string values in object', () => {
      const input = {
        name: '<script>alert("XSS")</script>Test',
        value: 123,
      };
      const result = sanitizeObject(input);
      expect(result.name).toBe('Test');
      expect(result.value).toBe(123);
    });

    it('should sanitize nested objects', () => {
      const input = {
        user: {
          name: '<div>John</div>',
          bio: '<script>alert("XSS")</script>Developer',
        },
      };
      const result = sanitizeObject(input);
      expect(result.user.name).toBe('John');
      expect(result.user.bio).toBe('Developer');
    });

    it('should sanitize arrays', () => {
      const input = ['<script>test</script>Hello', 'World'];
      const result = sanitizeObject(input);
      expect(result[0]).toBe('Hello');
      expect(result[1]).toBe('World');
    });

    it('should handle null and undefined', () => {
      expect(sanitizeObject(null)).toBe(null);
      expect(sanitizeObject(undefined)).toBe(undefined);
    });

    it('should preserve non-string values', () => {
      const input = {
        number: 123,
        boolean: true,
        nullValue: null,
        array: [1, 2, 3],
      };
      const result = sanitizeObject(input);
      expect(result.number).toBe(123);
      expect(result.boolean).toBe(true);
      expect(result.nullValue).toBe(null);
      expect(result.array).toEqual([1, 2, 3]);
    });

    it('should limit string length', () => {
      const input = {
        longString: 'a'.repeat(2000),
      };
      const result = sanitizeObject(input, 100);
      expect(result.longString.length).toBe(100);
    });
  });
});
