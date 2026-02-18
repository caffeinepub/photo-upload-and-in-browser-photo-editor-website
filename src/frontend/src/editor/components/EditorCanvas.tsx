import { useEffect, useRef } from 'react';
import { EditorSettings } from '../types';
import { applyImageProcessing } from '../processing/canvasPipeline';

interface EditorCanvasProps {
  originalImage: HTMLImageElement;
  settings: EditorSettings;
  onProcessingChange?: (processing: boolean) => void;
}

export default function EditorCanvas({
  originalImage,
  settings,
  onProcessingChange,
}: EditorCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !originalImage) return;

    onProcessingChange?.(true);

    // Use requestAnimationFrame for smooth rendering
    requestAnimationFrame(() => {
      try {
        applyImageProcessing(originalImage, settings, canvas);
      } catch (error) {
        console.error('Error processing image:', error);
      } finally {
        onProcessingChange?.(false);
      }
    });
  }, [originalImage, settings, onProcessingChange]);

  return (
    <div
      ref={containerRef}
      className="flex-1 bg-accent/5 rounded-lg border border-border overflow-hidden flex items-center justify-center p-4"
    >
      <canvas
        ref={canvasRef}
        className="max-w-full max-h-full object-contain shadow-lg"
      />
    </div>
  );
}
