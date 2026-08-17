export function hertzToMel(
  frequency: number,
): number {
  if (
    !Number.isFinite(frequency) ||
    frequency < 0
  ) {
    throw new Error(
      'Frequency must be a finite non-negative number.',
    )
  }

  return (
    2595 *
    Math.log10(
      1 +
        frequency / 700,
    )
  )
}

export function melToHertz(
  mel: number,
): number {
  if (
    !Number.isFinite(mel) ||
    mel < 0
  ) {
    throw new Error(
      'Mel value must be a finite non-negative number.',
    )
  }

  return (
    700 *
    (
      10 ** (
        mel / 2595
      ) -
      1
    )
  )
}