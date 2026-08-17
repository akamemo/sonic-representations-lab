# DSP Notes

This document describes the DSP that is actually implemented in the current MVP.

## Implemented Feature Set

### Scalar descriptors

- RMS Energy
- Spectral Centroid
- Spectral Flatness
- Spectral Flux
- Onset Strength

### Multidimensional representation

- 12-band Mel energies

Earlier design candidates such as Spectral Spread, Spectral Rolloff and Zero-Crossing Rate are not implemented in the MVP.

## Shared Parameters

| Parameter | Implemented value |
|---|---:|
| Spectral FFT size | 2048 samples |
| Spectral hop size | 1024 samples |
| Window | Hann |
| Spectral channel handling | average channels to mono |
| Mel bands | 12 |
| RMS frame size | 2048 samples |
| RMS hop size | 1024 samples |
| Analysis sample rate | original decoded file rate |

The spectral frame overlap is 50%.

## Shared Spectral Pipeline

For each spectral frame:

1. the decoded `AudioBuffer` is downmixed to mono;
2. a 2048-sample frame is extracted;
3. a Hann window is applied;
4. a real FFT is computed with `fft.js`;
5. the non-negative-frequency magnitude bins are calculated;
6. magnitudes are stored in one flat `Float32Array`;
7. the same frame is passed through the Mel filter bank.

This avoids recalculating the FFT for Centroid, Flatness, Flux, Spectrum, Spectrogram and Mel views.

## RMS Energy

### Definition

RMS measures the root mean square of the time-domain samples within a frame:

```text
RMS = sqrt((1 / N) * Σ x[n]^2)
```

### Implementation

`createRmsTimeline.ts`

- frame size: 2048;
- hop size: 1024;
- all channels are averaged per sample before squaring;
- the final frame is allowed to be shorter when the file ends.

### Interpretation

Higher values indicate greater short-term signal energy.

RMS is **not** a standardized perceived-loudness measurement.

### Canvas use

- Resonance: intensity / body size;
- Refraction: colour control after mapping-specific scaling;
- Fluxfield: structural disorder after mapping-specific scaling.

## Hann Window

`createHannWindow.ts` generates a Hann window used before each FFT.

Purpose:

- reduce discontinuities at frame boundaries;
- reduce spectral leakage compared with an unwindowed frame.

## Magnitude Spectrum

`createMagnitudeSpectrum.ts` uses `fft.js`.

For each complex FFT bin:

```text
magnitude = sqrt(real^2 + imaginary^2)
```

Only bins from DC through Nyquist are retained (`fftSize / 2 + 1` bins).

The displayed current-frame spectrum is converted to a relative decibel view in the visualization component; the stored analysis itself contains linear magnitudes.

## Spectral Centroid

### Definition

The magnitude-weighted mean frequency:

```text
centroid = Σ(f[k] * M[k]) / Σ(M[k])
```

DC is skipped.

### Interpretation

Often associated with spectral brightness: higher centroid means relatively more magnitude is concentrated at higher frequencies.

### Limitations

- sensitive to broadband noise;
- affected by isolated high-frequency energy;
- not a direct perceptual brightness model.

### Canvas use

- Resonance: colour;
- Refraction: intensity / body size;
- Fluxfield: motion.

## Spectral Flatness

### Definition

The ratio between geometric and arithmetic mean magnitude:

```text
flatness = geometricMean(M) / arithmeticMean(M)
```

The implementation:

- skips DC;
- floors each magnitude at `1e-12` before taking logarithms;
- clamps the final value to `[0, 1]`.

### Interpretation

- values closer to 0: more tone-like / concentrated spectrum;
- values closer to 1: flatter / more noise-like spectrum.

### Canvas use

- Resonance: structural disorder;
- Refraction: motion after track-relative normalization;
- Fluxfield: colour after track-relative normalization.

## Spectral Flux

### Algorithm

For each frame after the first:

1. compare each magnitude bin with the previous frame;
2. keep only positive magnitude increases;
3. sum those positive differences;
4. divide by the current frame's total magnitude.

Conceptually:

```text
flux = Σ max(0, M_t[k] - M_(t-1)[k]) / Σ M_t[k]
```

DC is skipped.

### Interpretation

Higher values indicate stronger short-term spectral change.

Normalizing by current-frame magnitude reduces, but does not completely remove, dependence on signal level.

### Canvas use

- Resonance: motion;
- Refraction: structural disorder;
- Fluxfield: intensity / body size.

## Onset Strength

### Implementation

Onset Strength is derived from the already-computed Spectral Flux timeline.

Algorithm:

1. smooth Flux with a radius-1 moving window;
2. estimate a slower local baseline using a radius-6 neighborhood;
3. compute positive deviation above the local baseline;
4. globally normalize the resulting timeline to `[0, 1]`.

Conceptually:

```text
onset[t] = max(0, smoothedFlux[t] - localBaseline[t])
```

followed by normalization by the maximum onset value in the recording.

### Interpretation

This is a lightweight **onset-strength / novelty signal**, not a full onset-event detector and not a probability.

It indicates how strongly the local spectral change rises above its surrounding baseline.

### Interface use

- displayed as a live, non-clickable indicator in Microscope;
- routed to `impulse` in all three Canvas presets.

### Canvas behavior

The renderer gives impulse a fast attack and slower decay, producing transient expansion, membrane excitation and internal lightness changes.

Particle bursts were considered as an optional extension but are not part of the stabilized MVP.

## Mel Representation

### Scale conversion

The project uses:

```text
mel = 2595 * log10(1 + f / 700)
```

and its inverse.

### Filter bank

`createMelFilterBank.ts` creates 12 triangular filters spaced evenly on the Mel scale between 0 Hz and Nyquist.

Weights are stored in a flattened band-major `Float32Array`.

### Band energy

For each spectral frame:

1. square each magnitude to obtain a simple power estimate;
2. multiply by the corresponding Mel-filter weight;
3. sum across bins for each band.

The resulting 12 energies are stored alongside the shared spectral analysis.

### Current use

Mel energies are visualized in Microscope as a perception-oriented representation.

They are **not currently used by the Canvas renderer**.

## Normalization and Mapping

Analysis values are kept separate from visual mapping.

`createScientificVisualState.ts` performs normalization and preset-specific routing.

Global maximum normalization is used for RMS, Centroid and Flux. Flatness is either used directly or normalized relative to the current recording depending on the selected mapping.

The renderer then applies its own useful visual ranges and smoothing.

This separation is important:

```text
measurement -> mapping -> visual state -> renderer
```

rather than:

```text
measurement -> renderer-specific interpretation
```

## Verification Signals

Useful synthetic or simple signals:

| Signal | Expected observation |
|---|---|
| Silence | RMS near zero; no meaningful spectral activity |
| Sine wave | narrow spectrum; low flatness |
| White noise | broad spectrum; higher flatness |
| Impulse / sharp transient | broadband change; strong Flux and Onset response |
| Frequency sweep | spectral peak and Centroid move over time |
| Amplitude ramp | RMS rises with amplitude |

See `TESTING.md` for the current validation procedure and limitations.
