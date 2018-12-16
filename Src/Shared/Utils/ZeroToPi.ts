/*
  Part of Kosmud

  Number in <0, 2π> interval.
*/

import { Classes } from "../../Shared/Class/Classes";
import { Angle } from "../../Shared/Utils/Angle";
import { NumberInInterval } from "../../Shared/Class/NumberInInterval";

export class ZeroToPi extends NumberInInterval
{
  public static minimum = 0;
  public static maximum = Angle.PI;
}

Classes.registerSerializableClass(ZeroToPi);