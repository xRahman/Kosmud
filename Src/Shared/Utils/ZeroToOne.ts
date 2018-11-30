/*
  Part of Kosmud

  Number in <0, 1> interval.
*/

import { Classes } from "../../Shared/Class/Classes";
import { Number } from "../../Shared/Utils/Number";

export class ZeroToOne extends Number
{
  protected static readonly MINIMUM = 0;
  protected static readonly MAXIMUM = 1;

  // ! Throws exception on error.
  constructor(value = 0)
  {
    // ! Throws exception on error.
    super(value);

    // ! Throws exception on error.
    Number.validate
    (
      value, ZeroToOne.MINIMUM, ZeroToOne.MAXIMUM
    );
  }

  public static clamp(value: number)
  {
    return new ZeroToOne
    (
      Number.clampValue(value, this.MINIMUM, this.MAXIMUM)
    );
  }
}

Classes.registerSerializableClass(ZeroToOne);