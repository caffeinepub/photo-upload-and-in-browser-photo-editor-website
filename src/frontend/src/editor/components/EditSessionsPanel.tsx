import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Save, Clock } from 'lucide-react';
import { EditorSettings } from '../types';
import { serializeSettings, deserializeSettings } from '../utils/serializeSettings';
import { useSaveEditMetadata, useGetRecentEdits } from '../../integrations/backend/hooks/useEditSessions';
import { UI_TEXT } from '../copy/uiText';

interface EditSessionsPanelProps {
  currentSettings: EditorSettings;
  onLoadSettings: (settings: EditorSettings) => void;
  disabled?: boolean;
}

export default function EditSessionsPanel({
  currentSettings,
  onLoadSettings,
  disabled,
}: EditSessionsPanelProps) {
  const [imageName, setImageName] = useState('');
  const saveEditMutation = useSaveEditMetadata();
  const { data: recentEdits, isLoading } = useGetRecentEdits();

  const handleSave = async () => {
    if (!imageName.trim()) return;

    const serialized = serializeSettings(currentSettings);
    await saveEditMutation.mutateAsync({
      imageName: imageName.trim(),
      editingSettings: serialized,
    });
    setImageName('');
  };

  const handleLoad = (editingSettings: string) => {
    const settings = deserializeSettings(editingSettings);
    if (settings) {
      onLoadSettings(settings);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{UI_TEXT.sessions.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="image-name">{UI_TEXT.sessions.imageName}</Label>
          <div className="flex gap-2">
            <Input
              id="image-name"
              value={imageName}
              onChange={(e) => setImageName(e.target.value)}
              placeholder={UI_TEXT.sessions.placeholder}
              disabled={disabled || saveEditMutation.isPending}
            />
            <Button
              onClick={handleSave}
              disabled={!imageName.trim() || disabled || saveEditMutation.isPending}
              size="icon"
            >
              <Save className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>{UI_TEXT.sessions.recent}</Label>
          <ScrollArea className="h-48 rounded-md border">
            <div className="p-2 space-y-2">
              {isLoading && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {UI_TEXT.sessions.loading}
                </p>
              )}
              {!isLoading && (!recentEdits || recentEdits.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {UI_TEXT.sessions.empty}
                </p>
              )}
              {recentEdits?.map((edit, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{edit.imageName}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(Number(edit.editTimestamp) / 1000000).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLoad(edit.editingSettings)}
                    disabled={disabled}
                  >
                    {UI_TEXT.sessions.load}
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
