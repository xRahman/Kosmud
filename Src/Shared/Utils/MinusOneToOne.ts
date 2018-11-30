/*
  Part of Kosmud

  Number in <-1, 1> interval.
*/

import { Classes } from "../../Shared/Class/Classes";
import { Number } from "../../Shared/Utils/Number";

export class MinusOneToOne extends Number
{
  protected static readonly MINIMUM = -1;
  protected static readonly MAXIMUM = 1;

  // ! Throws exception on error.
  constructor(value = 0)
  {
    // ! Throws exception on error.
    super(value);

    // ! Throws exception on error.
    Number.validate(value, MinusOneToOne.MINIMUM, MinusOneToOne.MAXIMUM);
  }

  public static clamp(value: number)
  {
    return new MinusOneToOne
    (
      Number.clampValue(value, this.MINIMUM, this.MAXIMUM)
    );
  }
}

Classes.registerSerializableClass(MinusOneToOne);