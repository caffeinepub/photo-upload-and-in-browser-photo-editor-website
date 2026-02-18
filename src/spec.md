# Specification

## Summary
**Goal:** Build a single-page, in-browser photo editor that supports upload, core canvas-based edits, export/download, and optional Internet Identity sign-in to save/list edit-session metadata.

**Planned changes:**
- Create a single-page editor UI to upload JPG/PNG/WebP images, preview them, show English errors for unsupported types, and provide a Reset action.
- Implement a canvas-based editing pipeline with live preview: crop (freeform + fixed ratios), rotate (90° steps), flip (horizontal/vertical), and brightness/contrast/saturation adjustments with combinable edits.
- Add export/download of the edited image as PNG or JPEG, including JPEG quality control.
- Add undo/redo for core actions, visible loading/processing states, and a responsive layout for mobile and desktop.
- Add optional Internet Identity sign-in/out and a Motoko canister API to save/list per-user edit sessions as metadata (timestamp + settings) and load a saved session to re-apply settings.
- Apply a coherent creative visual theme (no dominant blue/purple) and ensure all user-facing UI text is in English.
- Include generated static assets (logo + subtle background texture) as static files under `frontend/public/assets/generated` and reference them in the UI.

**User-visible outcome:** Users can upload a photo, edit it (crop/rotate/flip/adjust with undo/redo), reset changes, and download the result as PNG or JPEG (with quality control). Optionally, signed-in users can save and later reload their recent edit-session settings, with sessions kept private per user.
