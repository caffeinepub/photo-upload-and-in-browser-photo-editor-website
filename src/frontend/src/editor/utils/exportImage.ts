import { EditorSettings } from '../types';
import { applyImageProcessing } from '../processing/canvasPipeline';

export async function exportImage(
  originalImage: HTMLImageElement,
  settings: EditorSettings,
  format: 'png' | 'jpeg',
  quality: number = 90
): Promise<void> {
  const canvas = document.createElement('canvas');
  applyImageProcessing(originalImage, settings, canvas);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to create image blob'));
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        link.download = `edited-photo-${timestamp}.${format}`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        resolve();
      },
      format === 'png' ? 'image/png' : 'image/jpeg',
      quality / 100
    );
  });
}
