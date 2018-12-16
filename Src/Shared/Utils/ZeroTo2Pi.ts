/*
  Part of Kosmud

  Number in <0, 2π> interval.
*/

import { Classes } from "../../Shared/Class/Classes";
import { Angle } from "../../Shared/Utils/Angle";
import { Serializable } from "../../Shared/Class/Serializable";

export class ZeroTo2Pi extends Serializable
{
  private readonly value: number;

  // ! Throws exception on error.
  constructor(value: number)
  {
    super();

    this.value = Angle.zeroTo2Pi(value);
  }

  public valueOf(): number
  {
    return this.value;
  }
}

Classes.registerSerializableClass(ZeroTo2Pi);