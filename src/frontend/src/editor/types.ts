export interface EditorSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  rotation: number;
  flip: {
    horizontal: boolean;
    vertical: boolean;
  };
  crop: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
}

export const DEFAULT_SETTINGS: EditorSettings = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  rotation: 0,
  flip: {
    horizontal: false,
    vertical: false,
  },
  crop: null,
};
