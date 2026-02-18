import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UI_TEXT } from '../../copy/uiText';

interface CropPanelProps {
  originalImage: HTMLImageElement;
  currentCrop: { x: number; y: number; width: number; height: number } | null;
  onCropConfirm: (crop: { x: number; y: number; width: number; height: number } | null) => void;
  disabled?: boolean;
}

type CropRatio = 'free' | 'original' | '1:1' | '4:3' | '16:9';

export default function CropPanel({
  originalImage,
  currentCrop,
  onCropConfirm,
  disabled,
}: CropPanelProps) {
  const [ratio, setRatio] = useState<CropRatio>('free');

  const handleApplyCrop = () => {
    if (!originalImage) return;

    let cropRect = {
      x: 0,
      y: 0,
      width: originalImage.width,
      height: originalImage.height,
    };

    if (ratio !== 'free' && ratio !== 'original') {
      const [widthRatio, heightRatio] = ratio.split(':').map(Number);
      const targetRatio = widthRatio / heightRatio;
      const imageRatio = originalImage.width / originalImage.height;

      if (imageRatio > targetRatio) {
        // Image is wider, crop width
        cropRect.width = originalImage.height * targetRatio;
        cropRect.x = (originalImage.width - cropRect.width) / 2;
      } else {
        // Image is taller, crop height
        cropRect.height = originalImage.width / targetRatio;
        cropRect.y = (originalImage.height - cropRect.height) / 2;
      }
    }

    onCropConfirm(cropRect);
  };

  const handleClearCrop = () => {
    onCropConfirm(null);
    setRatio('free');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{UI_TEXT.crop.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">{UI_TEXT.crop.aspectRatio}</label>
          <Select value={ratio} onValueChange={(v) => setRatio(v as CropRatio)} disabled={disabled}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="free">{UI_TEXT.crop.ratios.free}</SelectItem>
              <SelectItem value="original">{UI_TEXT.crop.ratios.original}</SelectItem>
              <SelectItem value="1:1">{UI_TEXT.crop.ratios.square}</SelectItem>
              <SelectItem value="4:3">{UI_TEXT.crop.ratios.fourThree}</SelectItem>
              <SelectItem value="16:9">{UI_TEXT.crop.ratios.sixteenNine}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleApplyCrop} disabled={disabled} className="flex-1">
            {UI_TEXT.crop.apply}
          </Button>
          {currentCrop && (
            <Button variant="outline" onClick={handleClearCrop} disabled={disabled}>
              {UI_TEXT.crop.clear}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
