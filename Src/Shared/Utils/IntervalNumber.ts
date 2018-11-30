/*
  Part of Kosmud

  Number in <min, max> interval.
*/

import { Classes } from "../../Shared/Class/Classes";
import { Number } from "../../Shared/Utils/Number";

export class IntervalNumber extends Number
{
  private readonly minimum: number;
  private readonly maximum: number;

  // ! Throws exception on error.
  constructor(value: number, { min, max }: { min: number; max: number })
  {
    super(value);

    this.minimum = min;
    this.maximum = max;

    // ! Throws exception on error.
    Number.validate(value, min, max);
  }

  // ! Throws exception on error.
  public set value(value: number)
  {
    // ! Throws exception on error.
    Number.validate(value, this.minimum, this.maximum);

    super.value = value;
  }

  public clamp(value: number): this
  {
    super.value = Number.clampValue(value, this.minimum, this.maximum);

    return this;
  }
}

Classes.registerSerializableClass(IntervalNumber);