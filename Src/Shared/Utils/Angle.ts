/*
  Part of Kosmud

  Angle-related utility functions.
*/

// Augment global namespace with number-related functions and constants.
import "../../Shared/Utils/Number";

export namespace Angle
{
  export const PI = Math.PI;
  export const TWO_PI = Math.PI * 2;

  // Makes sure that 'angle' is between 0 and 2π.
  export function zeroTo2Pi(angle: number): number
  {
    return (angle % TWO_PI + TWO_PI) % TWO_PI;
  }

  export function minusPiToPi(angle: number): number
  {
    const tmpAngle = zeroTo2Pi(angle);

    if (tmpAngle <= PI)
      return tmpAngle;

    return tmpAngle - TWO_PI;
  }
}