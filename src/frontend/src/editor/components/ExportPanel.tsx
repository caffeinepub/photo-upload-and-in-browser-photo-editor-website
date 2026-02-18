import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Download } from 'lucide-react';
import { EditorSettings } from '../types';
import { exportImage } from '../utils/exportImage';
import { UI_TEXT } from '../copy/uiText';

interface ExportPanelProps {
  originalImage: HTMLImageElement;
  settings: EditorSettings;
  disabled?: boolean;
}

type ExportFormat = 'png' | 'jpeg';

export default function ExportPanel({ originalImage, settings, disabled }: ExportPanelProps) {
  const [format, setFormat] = useState<ExportFormat>('png');
  const [quality, setQuality] = useState(90);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportImage(originalImage, settings, format, quality);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{UI_TEXT.export.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="format">{UI_TEXT.export.format}</Label>
          <Select value={format} onValueChange={(v) => setFormat(v as ExportFormat)} disabled={disabled}>
            <SelectTrigger id="format">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="jpeg">JPEG</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {format === 'jpeg' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="quality">{UI_TEXT.export.quality}</Label>
              <span className="text-sm text-muted-foreground">{quality}%</span>
            </div>
            <Slider
              id="quality"
              min={1}
              max={100}
              step={1}
              value={[quality]}
              onValueChange={(values) => setQuality(values[0])}
              disabled={disabled}
            />
          </div>
        )}

        <Button
          onClick={handleExport}
          disabled={disabled || isExporting}
          className="w-full"
        >
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? UI_TEXT.export.exporting : UI_TEXT.export.download}
        </Button>
      </CardContent>
    </Card>
  );
}
