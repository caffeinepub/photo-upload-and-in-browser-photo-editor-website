import { Loader2 } from 'lucide-react';
import { UI_TEXT } from '../copy/uiText';

export default function ProcessingOverlay() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card rounded-lg p-6 shadow-lg flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-medium">{UI_TEXT.processing}</p>
      </div>
    </div>
  );
}
