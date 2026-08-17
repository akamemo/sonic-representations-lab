import type {
  MelFilterBank,
} from './createMelFilterBank'

export function calculateMelEnergies(
  magnitudes:
    | Float32Array
    | Float64Array,
  filterBank: MelFilterBank,
  output: Float32Array,
): void {
  if (
    magnitudes.length !==
    filterBank.binCount
  ) {
    throw new Error(
      'Magnitude spectrum size does not match Mel filter-bank bin count.',
    )
  }

  if (
    output.length !==
    filterBank.bandCount
  ) {
    throw new Error(
      'Mel-energy output size does not match Mel filter-bank band count.',
    )
  }

  for (
    let bandIndex = 0;
    bandIndex <
    filterBank.bandCount;
    bandIndex += 1
  ) {
    const weightOffset =
      bandIndex *
      filterBank.binCount

    let weightedEnergy = 0

    for (
      let binIndex = 0;
      binIndex <
      filterBank.binCount;
      binIndex += 1
    ) {
      const magnitude =
        magnitudes[
          binIndex
        ] ?? 0

      /*
       * Convert magnitude to a simple
       * power estimate before applying
       * the Mel filter weights.
       */
      const power =
        magnitude *
        magnitude

      const weight =
        filterBank.weights[
          weightOffset +
          binIndex
        ] ?? 0

      weightedEnergy +=
        power *
        weight
    }

    output[
      bandIndex
    ] =
      weightedEnergy
  }
}