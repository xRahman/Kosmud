/*
  Part of Kosmud

  Nonnegative floating point number.
*/

import { ClassFactory } from "../../Shared/Class/ClassFactory";
import { NumberWrapper } from "../../Shared/Class/NumberWrapper";

export class NonnegativeNumber extends NumberWrapper
{
  // ! Throws exception on error.
  constructor(value = 0)
  {
    super();

    // ! Throws exception on error.
    this.set(value);
  }

  // ! Throws exception on error.
  public set(value: number)
  {
    if (value < 0)
    {
      throw Error(`Attempt to set invalid value`
        + ` to a NonnegativeNumber (${value})`);
    }

    this.value = value;
  }
}

ClassFactory.registerClassPrototype(NonnegativeNumber);