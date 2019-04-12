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
    // This check isn't technically needed but computing
    // an angle which already is within valid range using
    // the following formula might change it a little bit
    // thanks to floating point rounding errors which can
    // trigger false alarms.
    if (angle >= 0 && angle < TWO_PI)
      return angle;

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