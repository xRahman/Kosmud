/*
  Part of Kosmud

  Positive floating point number.
*/

import { Classes } from "../../Shared/Class/Classes";
import { NumberWrapper } from "../../Shared/Class/NumberWrapper";

export class PositiveNumber extends NumberWrapper
{
  // ! Throws exception on error.
  constructor(value: number)
  {
    super();

    // ! Throws exception on error.
    this.set(value);
  }

  // ! Throws exception on error.
  public set(value: number)
  {
    if (value <= 0)
    {
      throw new Error(`Attempt to set invalid value`
        + ` to a PositiveNumber (${value})`);
    }

    this.value = value;
  }
}

Classes.registerSerializableClass(PositiveNumber);