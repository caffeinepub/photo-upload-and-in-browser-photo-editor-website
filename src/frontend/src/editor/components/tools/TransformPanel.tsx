import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RotateCcw, RotateCw, FlipHorizontal2, FlipVertical2 } from 'lucide-react';
import { UI_TEXT } from '../../copy/uiText';

interface TransformPanelProps {
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onFlipHorizontal: () => void;
  onFlipVertical: () => void;
  disabled?: boolean;
}

export default function TransformPanel({
  onRotateLeft,
  onRotateRight,
  onFlipHorizontal,
  onFlipVertical,
  disabled,
}: TransformPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{UI_TEXT.transform.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">{UI_TEXT.transform.rotate}</p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={onRotateLeft}
              disabled={disabled}
              className="w-full"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {UI_TEXT.transform.rotateLeft}
            </Button>
            <Button
              variant="outline"
              onClick={onRotateRight}
              disabled={disabled}
              className="w-full"
            >
              <RotateCw className="w-4 h-4 mr-2" />
              {UI_TEXT.transform.rotateRight}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">{UI_TEXT.transform.flip}</p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={onFlipHorizontal}
              disabled={disabled}
              className="w-full"
            >
              <FlipHorizontal2 className="w-4 h-4 mr-2" />
              {UI_TEXT.transform.flipH}
            </Button>
            <Button
              variant="outline"
              onClick={onFlipVertical}
              disabled={disabled}
              className="w-full"
            >
              <FlipVertical2 className="w-4 h-4 mr-2" />
              {UI_TEXT.transform.flipV}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
