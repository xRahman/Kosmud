/*
  Part of Kosmud

  Math-related utility functions.
*/

import { Vector } from "../../Shared/Physics/Vector";

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

// ! Throws exception on error.
export function validateNumber(value: number)
{
  if (!isValidNumber(value))
    throw new Error(`Invalid number: ${value}`);

  return value;
}

// ! Throws exception on error.
export function validateVector({ x, y }: { x: number; y: number })
{
  if (!isValidNumber(x))
    throw new Error(`Invalid 'x' in vector: ${x}`);

  if (!isValidNumber(y))
    throw new Error(`Invalid 'y' in vector: ${y}`);

  return new Vector({ x, y });
}

export function isValidNumber(value: number)
{
  return value !== null && value !== undefined
      && !Number.isNaN(value) && Number.isFinite(value);
}