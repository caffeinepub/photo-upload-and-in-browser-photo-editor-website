import { EditorSettings } from '../types';

export function applyImageProcessing(
  sourceImage: HTMLImageElement,
  settings: EditorSettings,
  targetCanvas: HTMLCanvasElement
): void {
  const ctx = targetCanvas.getContext('2d');
  if (!ctx) return;

  // Calculate dimensions after rotation
  const rotationRad = (settings.rotation * Math.PI) / 180;
  const isRotated90or270 = Math.abs(settings.rotation % 180) === 90;

  let sourceWidth = sourceImage.width;
  let sourceHeight = sourceImage.height;
  let sourceX = 0;
  let sourceY = 0;

  // Apply crop to source dimensions
  if (settings.crop) {
    sourceX = settings.crop.x;
    sourceY = settings.crop.y;
    sourceWidth = settings.crop.width;
    sourceHeight = settings.crop.height;
  }

  // Set canvas size based on rotation
  if (isRotated90or270) {
    targetCanvas.width = sourceHeight;
    targetCanvas.height = sourceWidth;
  } else {
    targetCanvas.width = sourceWidth;
    targetCanvas.height = sourceHeight;
  }

  // Clear canvas
  ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);

  // Save context state
  ctx.save();

  // Move to center for transformations
  ctx.translate(targetCanvas.width / 2, targetCanvas.height / 2);

  // Apply rotation
  ctx.rotate(rotationRad);

  // Apply flip
  const scaleX = settings.flip.horizontal ? -1 : 1;
  const scaleY = settings.flip.vertical ? -1 : 1;
  ctx.scale(scaleX, scaleY);

  // Draw image centered
  const drawWidth = isRotated90or270 ? sourceHeight : sourceWidth;
  const drawHeight = isRotated90or270 ? sourceWidth : sourceHeight;
  
  ctx.drawImage(
    sourceImage,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    -drawWidth / 2,
    -drawHeight / 2,
    drawWidth,
    drawHeight
  );

  // Restore context
  ctx.restore();

  // Apply adjustments using filters
  const imageData = ctx.getImageData(0, 0, targetCanvas.width, targetCanvas.height);
  applyAdjustments(imageData, settings);
  ctx.putImageData(imageData, 0, 0);
}

function applyAdjustments(imageData: ImageData, settings: EditorSettings): void {
  const data = imageData.data;
  const brightness = settings.brightness;
  const contrast = settings.contrast;
  const saturation = settings.saturation;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Apply brightness
    r += brightness;
    g += brightness;
    b += brightness;

    // Apply contrast
    const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    r = contrastFactor * (r - 128) + 128;
    g = contrastFactor * (g - 128) + 128;
    b = contrastFactor * (b - 128) + 128;

    // Apply saturation
    const gray = 0.2989 * r + 0.587 * g + 0.114 * b;
    const satFactor = (saturation + 100) / 100;
    r = gray + satFactor * (r - gray);
    g = gray + satFactor * (g - gray);
    b = gray + satFactor * (b - gray);

    // Clamp values
    data[i] = Math.max(0, Math.min(255, r));
    data[i + 1] = Math.max(0, Math.min(255, g));
    data[i + 2] = Math.max(0, Math.min(255, b));
  }
}
