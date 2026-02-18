import { EditorSettings, DEFAULT_SETTINGS } from '../types';

export function serializeSettings(settings: EditorSettings): string {
  return JSON.stringify(settings);
}

export function deserializeSettings(serialized: string): EditorSettings | null {
  try {
    const parsed = JSON.parse(serialized);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
    };
  } catch (error) {
    console.error('Failed to deserialize settings:', error);
    return null;
  }
}
