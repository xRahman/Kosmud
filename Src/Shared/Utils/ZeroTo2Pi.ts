/*
  Part of Kosmud

  Number in <0, 2π> interval.
*/

import { ClassFactory } from "../../Shared/Class/ClassFactory";
import { Angle } from "../../Shared/Utils/Angle";
import { NumberWrapper } from "../../Shared/Class/NumberWrapper";

export class ZeroTo2Pi extends NumberWrapper
{
  constructor(value: number)
  {
    super();

    this.set(value);
  }

  public set(value: number)
  {
    this.value = Angle.zeroTo2Pi(value);
  }
}

ClassFactory.registerClassPrototype(ZeroTo2Pi);