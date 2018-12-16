/*
  Part of Kosmud

  Nonnegative float.
*/

import { Serializable } from "../../Shared/Class/Serializable";

export abstract class NonnegativeNumber extends Serializable
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