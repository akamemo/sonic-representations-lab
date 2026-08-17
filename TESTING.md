# Testing and Validation

## Current Testing Position

The MVP currently uses:

- TypeScript compilation through `npm run build`;
- ESLint through `npm run lint`;
- manual integration and visual smoke testing;
- synthetic/simple-signal reasoning for DSP validation.

There is **no automated unit-test framework in the current repository**. This is a known limitation and should not be represented otherwise.

## Quality Gate

Before a stabilization or release commit:

```bash
npm run lint
npm run build
```

Expected result: both commands finish without errors.

## DSP Verification Matrix

Use short, known signals where possible.

| Signal | RMS | Spectrum / Centroid | Flatness | Flux / Onset |
|---|---|---|---|---|
| Silence | near zero | no meaningful energy | interpret cautiously | near zero |
| Steady sine | stable | one dominant peak; centroid near tone | low | low after attack |
| White noise | non-zero | broadband | relatively high | variable |
| Single impulse | brief energy | broadband | high/broad | strong transient |
| Frequency sweep | depends on amplitude | peak/centroid move upward or downward | generally low for clean tone | responds to changing spectrum |
| Amplitude ramp | increases | spectral location stable for pure tone | stable | limited if spectral shape is unchanged |

The goal is not to force exact textbook values from every browser signal generator, but to verify plausible direction and relative behavior.

## Manual Integration Checklist

### Welcome

- [ ] page loads without console errors;
- [ ] pixel-wave background renders;
- [ ] About button opens the dialog;
- [ ] About dialog closes with the close button;
- [ ] About dialog closes with Escape;
- [ ] About dialog can close from the backdrop;
- [ ] privacy/local-processing message is visible.

### File input

- [ ] supported file can be selected with file picker;
- [ ] supported file can be drag-dropped;
- [ ] unsupported extension produces readable error;
- [ ] browser does not navigate to a dropped file;
- [ ] decoding failure returns to a recoverable state.

### Loading / analysis

- [ ] loading state appears;
- [ ] decoded metadata is plausible;
- [ ] analysis completes;
- [ ] Start Exploring enters Laboratory.

### Playback

- [ ] Play starts from current offset;
- [ ] Pause preserves position;
- [ ] Play resumes from paused position;
- [ ] Stop returns to zero;
- [ ] seek preview updates the interface;
- [ ] seek commit updates playback;
- [ ] seeking while playing resumes correctly;
- [ ] natural playback end reaches the file duration;
- [ ] Start New Experiment stops playback and clears state.

### Microscope

Check all four representations:

- [ ] Waveform;
- [ ] Magnitude Spectrum;
- [ ] Spectrogram;
- [ ] Mel Representation.

For each relevant view:

- [ ] resizes with its container;
- [ ] current playback position is synchronized;
- [ ] labels remain readable;
- [ ] no canvas overflow or uncontrolled growth occurs.

Descriptor panel:

- [ ] RMS live value updates;
- [ ] Centroid live value updates;
- [ ] Flux live value updates;
- [ ] Flatness live value updates;
- [ ] Onset Strength live value updates;
- [ ] RMS trend can be selected;
- [ ] Centroid trend can be selected;
- [ ] Flux trend can be selected;
- [ ] Flatness trend can be selected;
- [ ] Onset row is informational rather than clickable.

### Canvas

- [ ] organism renders before playback;
- [ ] organism animates during playback;
- [ ] live five-parameter readings update;
- [ ] mini progress bars remain aligned;
- [ ] Resonance button changes active preset;
- [ ] Refraction button changes active preset;
- [ ] Fluxfield button changes active preset;
- [ ] right-side About and Mapping sections update with preset;
- [ ] playback position is preserved when changing preset;
- [ ] switching Microscope ↔ Canvas preserves playback;
- [ ] strong transients produce a visible impulse response;
- [ ] no removed shockwave/ring artifact reappears.

## Responsive Smoke Test

At minimum check:

- normal desktop width;
- browser zoom around 90–100%;
- narrow desktop/mobile-like width.

Verify:

- no horizontal page overflow;
- Canvas does not enter a height-growth feedback loop;
- right-side Canvas panel is usable;
- Microscope layout collapses without broken controls;
- About dialog remains usable.

## Browser Compatibility

Recommended final pass:

- [ ] Chrome / Chromium;
- [ ] Edge;
- [ ] Firefox;
- [ ] Safari if available and required.

Codec decoding may differ between browsers.

## Regression Tests for Recent Stabilization Work

After CSS/code cleanup:

- [x] build passes locally;
- [x] lint passes locally;
- [x] dead legacy files removed without breaking imports;
- [x] Microscope visually smoke-tested;
- [x] Canvas visually smoke-tested;
- [x] all three mappings confirmed operational;
- [x] About dialog added and checked by the developer.

Before submission, rerun the entire manual checklist and record any failures or browser-specific limitations.

## MVP Acceptance Criteria

The MVP passes when:

- a compatible local audio file can be loaded and decoded;
- playback and seeking work;
- the four Microscope representations are synchronized;
- five descriptor values are available;
- descriptor trends behave plausibly;
- Canvas uses the same prepared analysis;
- three mapping presets visibly produce different interpretations;
- changing mode or preset does not reset the experiment;
- About and privacy information are available;
- no console errors occur in the primary journey;
- `npm run lint` and `npm run build` pass.

## Future Testing Improvements

If time permits:

- add Vitest or another unit-test runner;
- automate RMS, centroid, flatness, flux, onset and Mel-filter checks with synthetic arrays;
- add component tests for preset switching;
- add end-to-end browser tests for the main user journey.
