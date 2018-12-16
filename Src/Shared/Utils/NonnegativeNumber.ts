/*
  Part of Kosmud

  Nonnegative floating point number.
*/

import { Classes } from "../../Shared/Class/Classes";
import { Serializable } from "../../Shared/Class/Serializable";

export class NonnegativeNumber extends Serializable
{
  private readonly value: number;

  constructor(value = 0)
  {
    super();

    if (value < 0)
    {
      throw new Error(`Attempt to assign invalid value`
        + ` to a NonnegativeNumber (${value})`);
    }

    this.value = value;
  }

  public valueOf(): number
  {
    return this.value;
  }
}

Classes.registerSerializableClass(NonnegativeNumber);