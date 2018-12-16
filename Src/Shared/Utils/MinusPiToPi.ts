/*
  Part of Kosmud

  Number in <-π, π> interval.
*/

import { Classes } from "../../Shared/Class/Classes";
import { Angle } from "../../Shared/Utils/Angle";
import { Serializable } from "../../Shared/Class/Serializable";

export class MinusPiToPi extends Serializable
{
  private readonly value: number;

  // ! Throws exception on error.
  constructor(value: number)
  {
    super();

    this.value = Angle.minusPiToPi(value);
  }

  public valueOf(): number
  {
    return this.value;
  }
}

Classes.registerSerializableClass(MinusPiToPi);