/*
  Part of Kosmud

  Number in <-π, π> interval.
*/

import { ClassFactory } from "../../Shared/Class/ClassFactory";
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

ClassFactory.registerClassPrototype(MinusPiToPi);