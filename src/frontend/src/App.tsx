import { useState } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import LoginButton from './components/auth/LoginButton';
import ProfileSetupDialog from './components/auth/ProfileSetupDialog';
import EditorCanvas from './editor/components/EditorCanvas';
import TransformPanel from './editor/components/tools/TransformPanel';
import AdjustmentsPanel from './editor/components/tools/AdjustmentsPanel';
import CropPanel from './editor/components/tools/CropPanel';
import ExportPanel from './editor/components/ExportPanel';
import EditSessionsPanel from './editor/components/EditSessionsPanel';
import ProcessingOverlay from './editor/components/ProcessingOverlay';
import { useEditorState } from './editor/hooks/useEditorState';
import { useUndoRedo } from './editor/hooks/useUndoRedo';
import { useProcessingIndicator } from './editor/hooks/useProcessingIndicator';
import { validateImageFile } from './editor/utils/fileValidation';
import { UI_TEXT } from './editor/copy/uiText';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Upload, Undo2, Redo2, RotateCcw } from 'lucide-react';
import { SiX, SiGithub } from 'react-icons/si';

export default function App() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { isProcessing, startProcessing, stopProcessing } = useProcessingIndicator();

  const {
    settings,
    updateBrightness,
    updateContrast,
    updateSaturation,
    updateRotation,
    updateFlip,
    updateCrop,
    resetSettings,
    applySettings,
  } = useEditorState();

  const { canUndo, canRedo, undo, redo, saveState } = useUndoRedo(settings, applySettings);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || UI_TEXT.errors.unsupportedFile);
      return;
    }

    setUploadError(null);
    startProcessing();

    const img = new Image();
    img.onload = () => {
      setOriginalImage(img);
      resetSettings();
      stopProcessing();
    };
    img.onerror = () => {
      setUploadError(UI_TEXT.errors.loadFailed);
      stopProcessing();
    };
    img.src = URL.createObjectURL(file);
  };

  const handleReset = () => {
    resetSettings();
    saveState(settings);
  };

  const handleUndo = () => {
    undo();
  };

  const handleRedo = () => {
    redo();
  };

  const handleAdjustmentChange = (type: 'brightness' | 'contrast' | 'saturation', value: number) => {
    if (type === 'brightness') updateBrightness(value);
    if (type === 'contrast') updateContrast(value);
    if (type === 'saturation') updateSaturation(value);
  };

  const handleAdjustmentComplete = () => {
    saveState(settings);
  };

  const handleRotate = (direction: 'left' | 'right') => {
    const newRotation = direction === 'left' ? settings.rotation - 90 : settings.rotation + 90;
    updateRotation(newRotation);
    saveState({ ...settings, rotation: newRotation });
  };

  const handleFlip = (direction: 'horizontal' | 'vertical') => {
    const newFlip = {
      ...settings.flip,
      [direction]: !settings.flip[direction],
    };
    updateFlip(newFlip);
    saveState({ ...settings, flip: newFlip });
  };

  const handleCropConfirm = (cropRect: { x: number; y: number; width: number; height: number } | null) => {
    updateCrop(cropRect);
    saveState({ ...settings, crop: cropRect });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Background texture */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'url(/assets/generated/editor-bg-texture.dim_1600x900.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Header */}
      <header className="relative z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/photo-editor-logo.dim_512x512.png"
              alt="Photo Editor"
              className="w-10 h-10"
            />
            <h1 className="text-2xl font-bold tracking-tight">{UI_TEXT.app.title}</h1>
          </div>
          <LoginButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Editor Canvas Area */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Upload Section */}
          {!originalImage && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4 max-w-md">
                <div className="w-24 h-24 mx-auto rounded-full bg-accent/20 flex items-center justify-center">
                  <Upload className="w-12 h-12 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-semibold">{UI_TEXT.upload.title}</h2>
                <p className="text-muted-foreground">{UI_TEXT.upload.description}</p>
                <label htmlFor="file-upload">
                  <Button asChild size="lg" className="cursor-pointer">
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      {UI_TEXT.upload.button}
                    </span>
                  </Button>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                {uploadError && (
                  <p className="text-destructive text-sm mt-2">{uploadError}</p>
                )}
              </div>
            </div>
          )}

          {/* Canvas and Controls */}
          {originalImage && (
            <>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUndo}
                    disabled={!canUndo || isProcessing}
                  >
                    <Undo2 className="w-4 h-4 mr-2" />
                    {UI_TEXT.actions.undo}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRedo}
                    disabled={!canRedo || isProcessing}
                  >
                    <Redo2 className="w-4 h-4 mr-2" />
                    {UI_TEXT.actions.redo}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    disabled={isProcessing}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {UI_TEXT.actions.reset}
                  </Button>
                </div>
                <label htmlFor="file-upload-replace">
                  <Button variant="secondary" size="sm" asChild>
                    <span className="cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      {UI_TEXT.upload.change}
                    </span>
                  </Button>
                </label>
                <input
                  id="file-upload-replace"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <EditorCanvas
                originalImage={originalImage}
                settings={settings}
                onProcessingChange={(processing) => {
                  if (processing) startProcessing();
                  else stopProcessing();
                }}
              />
            </>
          )}
        </div>

        {/* Tools Sidebar */}
        {originalImage && (
          <aside className="w-full lg:w-80 flex flex-col gap-4">
            <Tabs defaultValue="adjustments" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="adjustments">{UI_TEXT.tools.adjustments}</TabsTrigger>
                <TabsTrigger value="transform">{UI_TEXT.tools.transform}</TabsTrigger>
                <TabsTrigger value="crop">{UI_TEXT.tools.crop}</TabsTrigger>
              </TabsList>
              <TabsContent value="adjustments" className="mt-4">
                <AdjustmentsPanel
                  brightness={settings.brightness}
                  contrast={settings.contrast}
                  saturation={settings.saturation}
                  onBrightnessChange={(v) => handleAdjustmentChange('brightness', v)}
                  onContrastChange={(v) => handleAdjustmentChange('contrast', v)}
                  onSaturationChange={(v) => handleAdjustmentChange('saturation', v)}
                  onChangeComplete={handleAdjustmentComplete}
                  disabled={isProcessing}
                />
              </TabsContent>
              <TabsContent value="transform" className="mt-4">
                <TransformPanel
                  onRotateLeft={() => handleRotate('left')}
                  onRotateRight={() => handleRotate('right')}
                  onFlipHorizontal={() => handleFlip('horizontal')}
                  onFlipVertical={() => handleFlip('vertical')}
                  disabled={isProcessing}
                />
              </TabsContent>
              <TabsContent value="crop" className="mt-4">
                <CropPanel
                  originalImage={originalImage}
                  currentCrop={settings.crop}
                  onCropConfirm={handleCropConfirm}
                  disabled={isProcessing}
                />
              </TabsContent>
            </Tabs>

            <ExportPanel
              originalImage={originalImage}
              settings={settings}
              disabled={isProcessing}
            />

            {isAuthenticated && (
              <EditSessionsPanel
                currentSettings={settings}
                onLoadSettings={(loadedSettings) => {
                  applySettings(loadedSettings);
                  saveState(loadedSettings);
                }}
                disabled={isProcessing}
              />
            )}
          </aside>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border bg-background/80 backdrop-blur-sm py-6 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {UI_TEXT.app.title}. {UI_TEXT.footer.rights}
            </p>
            <div className="flex items-center gap-4">
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {UI_TEXT.footer.builtWith} ❤️ {UI_TEXT.footer.using}
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Profile Setup Dialog */}
      <ProfileSetupDialog />

      {/* Processing Overlay */}
      {isProcessing && <ProcessingOverlay />}
    </div>
  );
}
