/*
  Part of Kosmud

  Math-related utility functions.
*/

const TWO_PI = Math.PI * 2;

export function lowerBound(value: number, bound: number)
{
  if (value < bound)
    return bound;

  return value;
}

export function upperBound(value: number, bound: number)
{
  if (value > bound)
    return bound;

  return value;
}

export function intervalBound
(
  value: number,
  { from, to }: { from: number; to: number }
)
{
  if (value < from)
    return from;

  if (value > to)
    return to;

  return value;
}

// Makes sure that 'angle' is between 0 and 2π.
export function normalizeAngle(angle: number): number
{
  return (angle % TWO_PI + TWO_PI) % TWO_PI;
}