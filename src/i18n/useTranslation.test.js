import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTranslation, changeLanguage } from './useTranslation';
import { SUPPORTED_LANGUAGES } from './config';

describe('useTranslation', () => {
  beforeEach(() => {
    // Reset language to default
    localStorage.clear();
  });

  it('should return translation function and current language', () => {
    const { result } = renderHook(() => useTranslation());

    expect(result.current.t).toBeDefined();
    expect(result.current.language).toBeDefined();
    expect(result.current.changeLanguage).toBeDefined();
  });

  it('should translate a simple key', () => {
    const { result } = renderHook(() => useTranslation());

    const translation = result.current.t('nav.dashboard');
    expect(translation).toBe('Дашборд'); // Russian default
  });

  it('should translate nested keys', () => {
    const { result } = renderHook(() => useTranslation());

    const translation = result.current.t('error.title');
    expect(translation).toBe('Что-то пошло не так');
  });

  it('should return key if translation not found', () => {
    const { result } = renderHook(() => useTranslation());

    const translation = result.current.t('nonexistent.key');
    expect(translation).toBe('nonexistent.key');
  });

  it('should change language', () => {
    const { result } = renderHook(() => useTranslation());

    act(() => {
      changeLanguage(SUPPORTED_LANGUAGES.EN);
    });

    // Wait for state update
    const translation = result.current.t('nav.dashboard');
    expect(translation).toBe('Dashboard');
  });

  it('should persist language choice in state', async () => {
    const { result } = renderHook(() => useTranslation());

    await act(async () => {
      result.current.changeLanguage(SUPPORTED_LANGUAGES.EN);
    });

    // Verify language state is updated
    expect(result.current.language).toBe(SUPPORTED_LANGUAGES.EN);

    // Verify translations are in English
    const translation = result.current.t('nav.dashboard');
    expect(translation).toBe('Dashboard');
  });

  it('should not change to unsupported language', () => {
    const { result } = renderHook(() => useTranslation());
    const initialLang = result.current.language;

    act(() => {
      changeLanguage('unsupported');
    });

    expect(result.current.language).toBe(initialLang);
  });
});
