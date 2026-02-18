import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UI_TEXT } from '../../copy/uiText';

interface AdjustmentsPanelProps {
  brightness: number;
  contrast: number;
  saturation: number;
  onBrightnessChange: (value: number) => void;
  onContrastChange: (value: number) => void;
  onSaturationChange: (value: number) => void;
  onChangeComplete?: () => void;
  disabled?: boolean;
}

export default function AdjustmentsPanel({
  brightness,
  contrast,
  saturation,
  onBrightnessChange,
  onContrastChange,
  onSaturationChange,
  onChangeComplete,
  disabled,
}: AdjustmentsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{UI_TEXT.adjustments.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="brightness">{UI_TEXT.adjustments.brightness}</Label>
            <span className="text-sm text-muted-foreground">{brightness}</span>
          </div>
          <Slider
            id="brightness"
            min={-100}
            max={100}
            step={1}
            value={[brightness]}
            onValueChange={(values) => onBrightnessChange(values[0])}
            onValueCommit={onChangeComplete}
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="contrast">{UI_TEXT.adjustments.contrast}</Label>
            <span className="text-sm text-muted-foreground">{contrast}</span>
          </div>
          <Slider
            id="contrast"
            min={-100}
            max={100}
            step={1}
            value={[contrast]}
            onValueChange={(values) => onContrastChange(values[0])}
            onValueCommit={onChangeComplete}
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="saturation">{UI_TEXT.adjustments.saturation}</Label>
            <span className="text-sm text-muted-foreground">{saturation}</span>
          </div>
          <Slider
            id="saturation"
            min={-100}
            max={100}
            step={1}
            value={[saturation]}
            onValueChange={(values) => onSaturationChange(values[0])}
            onValueCommit={onChangeComplete}
            disabled={disabled}
          />
        </div>
      </CardContent>
    </Card>
  );
}
