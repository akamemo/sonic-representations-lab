# DSP Notes

This file documents the signal-processing concepts used by the application.

For each feature, record:

1. definition;
2. formula or algorithm;
3. frame size and hop size;
4. normalization;
5. interpretation;
6. limitations;
7. analytical visualization;
8. artistic mapping rationale;
9. test signal used for verification.

## Shared Analysis Parameters

| Parameter | Initial value | Status |
|---|---:|---|
| Analysis sample rate | Original file rate | To confirm |
| Channel handling | Downmix to mono | Proposed |
| Frame size | 2048 samples | Proposed |
| Hop size | 512 samples | Proposed |
| Window | Hann | Proposed |
| FFT size | 2048 | Proposed |

These values are starting assumptions and must be validated.

---

## RMS Energy

### Meaning

Measures signal energy over a frame and provides an approximate indicator of intensity.

### Proposed Artistic Mappings

- object scale;
- brightness;
- particle quantity.

### Limitations

RMS is not equivalent to standardized perceived loudness.

---

## Spectral Centroid

### Meaning

Represents the weighted center of the magnitude spectrum and often correlates with perceived brightness.

### Proposed Artistic Mappings

- hue;
- vertical position;
- shape sharpness.

### Limitations

Can be strongly affected by noise and isolated high-frequency components.

---

## Spectral Flatness

### Meaning

Measures how noise-like or tone-like a spectrum is.

### Proposed Artistic Mappings

- texture roughness;
- visual grain;
- geometric regularity.

### Limitations

Interpretation depends on frequency range and silence handling.

---

## Spectral Rolloff

### Meaning

The frequency below which a chosen percentage of spectral energy is concentrated.

### Proposed Artistic Mappings

- visual radius;
- spread;
- occupied area.

### Open Decision

Choose and justify a rolloff percentage, commonly 85% or 95%.

---

## Zero-Crossing Rate

### Meaning

Counts how frequently the time-domain signal changes sign within a frame.

### Proposed Artistic Mappings

- movement irregularity;
- line density;
- flicker.

### Limitations

Can be sensitive to noise and does not independently describe timbre.

---

## Onset Strength

### Meaning

Estimates the appearance of new acoustic events or transients.

### Proposed Artistic Mappings

- flashes;
- particle bursts;
- creation of new shapes.

### Open Decision

Select an onset method, likely spectral flux with thresholding.

---

## Verification Plan

Use simple test signals before analysing music:

- silence;
- sine wave;
- white noise;
- impulse;
- amplitude ramp;
- frequency sweep.

Expected behavior should be written before testing.
