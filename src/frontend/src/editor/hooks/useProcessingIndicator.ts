import { useState, useCallback } from 'react';

export function useProcessingIndicator() {
  const [isProcessing, setIsProcessing] = useState(false);

  const startProcessing = useCallback(() => {
    setIsProcessing(true);
  }, []);

  const stopProcessing = useCallback(() => {
    setIsProcessing(false);
  }, []);

  return {
    isProcessing,
    startProcessing,
    stopProcessing,
  };
}
