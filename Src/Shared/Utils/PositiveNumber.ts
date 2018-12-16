/*
  Part of Kosmud

  Positive floating point number.
*/

import { Classes } from "../../Shared/Class/Classes";
import { Serializable } from "../../Shared/Class/Serializable";

export class PositiveNumber extends Serializable
{
  private readonly value: number;

  // ! Throws exception on error.
  constructor(value: number)
  {
    super();

    if (value <= 0)
    {
      throw new Error(`Attempt to assign invalid value`
        + ` to a PositiveNumber (${value})`);
    }

    this.value = value;
  }

  public valueOf(): number
  {
    return this.value;
  }
}

Classes.registerSerializableClass(PositiveNumber);