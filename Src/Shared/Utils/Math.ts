/*
  Part of Kosmud

  Math-related utility functions.
*/

export function lowerBound(value: number, bound: number)
{
  return Math.max(value, bound);
}

export function upperBound(value: number, bound: number)
{
  return Math.min(value, bound);
}

export function intervalBound
(
  value: number,
  { from, to }: { from: number; to: number }
)
{
  return Math.min(Math.max(value, from), to);
}