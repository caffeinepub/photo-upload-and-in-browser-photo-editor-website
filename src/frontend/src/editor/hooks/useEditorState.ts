import { useState, useCallback } from 'react';
import { EditorSettings, DEFAULT_SETTINGS } from '../types';

export function useEditorState() {
  const [settings, setSettings] = useState<EditorSettings>(DEFAULT_SETTINGS);

  const updateBrightness = useCallback((value: number) => {
    setSettings((prev) => ({ ...prev, brightness: value }));
  }, []);

  const updateContrast = useCallback((value: number) => {
    setSettings((prev) => ({ ...prev, contrast: value }));
  }, []);

  const updateSaturation = useCallback((value: number) => {
    setSettings((prev) => ({ ...prev, saturation: value }));
  }, []);

  const updateRotation = useCallback((value: number) => {
    setSettings((prev) => ({ ...prev, rotation: value % 360 }));
  }, []);

  const updateFlip = useCallback((flip: { horizontal: boolean; vertical: boolean }) => {
    setSettings((prev) => ({ ...prev, flip }));
  }, []);

  const updateCrop = useCallback(
    (crop: { x: number; y: number; width: number; height: number } | null) => {
      setSettings((prev) => ({ ...prev, crop }));
    },
    []
  );

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const applySettings = useCallback((newSettings: EditorSettings) => {
    setSettings(newSettings);
  }, []);

  return {
    settings,
    updateBrightness,
    updateContrast,
    updateSaturation,
    updateRotation,
    updateFlip,
    updateCrop,
    resetSettings,
    applySettings,
  };
}
