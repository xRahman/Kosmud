/*
  Part of Kosmud

  Nonnegative float.
*/

import { Serializable } from "../../Shared/Class/Serializable";

export abstract class PositiveNumber extends Serializable
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