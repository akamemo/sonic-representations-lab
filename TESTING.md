# Testing Strategy

## Testing Goals

- Verify mathematical correctness.
- Verify playback and visualization synchronization.
- Prevent regressions during AI-assisted coding.
- Document limitations honestly.

## Test Levels

### Unit Tests

Suitable for:

- RMS
- zero-crossing rate
- centroid
- flatness
- rolloff
- normalization helpers

### Synthetic Signal Tests

| Signal | Expected observation |
|---|---|
| Silence | RMS near zero; no meaningful centroid |
| Sine wave | Narrow spectral peak; low flatness |
| White noise | Broad spectrum; high flatness |
| Impulse | Broadband spectrum; strong onset |
| Frequency sweep | Moving spectral peak |
| Amplitude ramp | Increasing RMS |

### Integration Tests

- Select a supported file using the native file picker
- Drop a supported file onto the upload area
- Reject an unsupported extension with a readable message
- Prevent dropped files from opening through the browser’s default behaviour
- Replace the previous selection when a new valid file is supplied
- Upload and decode a browser-supported audio file
- Playback starts and stops correctly
- Seeking updates all visualizations
- Track replacement clears old state
- Analysis errors produce readable messages

### Browser Tests

- Latest Chrome
- Latest Firefox
- Latest Edge
- Safari if time permits

## MVP Acceptance Criteria

- No console errors during the primary user journey.
- A valid audio file can be uploaded and played.
- The waveform and playback cursor remain synchronized.
- Feature values react plausibly to synthetic test signals.
- Microscope and Canvas use the same analysis timeline.
- The deployed GitHub Pages build works from a clean browser session.
