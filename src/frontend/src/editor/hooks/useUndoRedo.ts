import { useState, useCallback } from 'react';
import { EditorSettings } from '../types';

const MAX_HISTORY = 50;

export function useUndoRedo(
  currentSettings: EditorSettings,
  applySettings: (settings: EditorSettings) => void
) {
  const [history, setHistory] = useState<EditorSettings[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const saveState = useCallback(
    (settings: EditorSettings) => {
      setHistory((prev) => {
        const newHistory = prev.slice(0, currentIndex + 1);
        newHistory.push(JSON.parse(JSON.stringify(settings)));
        if (newHistory.length > MAX_HISTORY) {
          newHistory.shift();
          return newHistory;
        }
        setCurrentIndex(newHistory.length - 1);
        return newHistory;
      });
    },
    [currentIndex]
  );

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      applySettings(history[newIndex]);
    }
  }, [currentIndex, history, applySettings]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      applySettings(history[newIndex]);
    }
  }, [currentIndex, history, applySettings]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  return {
    saveState,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}
