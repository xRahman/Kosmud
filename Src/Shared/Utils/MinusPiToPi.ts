/*
  Part of Kosmud

  Number in <-π, π> interval.
*/

import { Classes } from "../../Shared/Class/Classes";
import { Angle } from "../../Shared/Utils/Angle";
import { NumberWrapper } from "../../Shared/Class/NumberWrapper";

export class MinusPiToPi extends NumberWrapper
{
  constructor(value: number)
  {
    super();

    this.set(value);
  }

  public set(value: number)
  {
    this.value = Angle.minusPiToPi(value);
  }
}

Classes.registerSerializableClass(MinusPiToPi);