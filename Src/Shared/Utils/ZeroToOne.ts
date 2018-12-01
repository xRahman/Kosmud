/*
  Part of Kosmud

  Number in <0, 1> interval.
*/

import { Classes } from "../../Shared/Class/Classes";
import { NumberInInterval } from "../../Shared/Class/NumberInInterval";

export class ZeroToOne extends NumberInInterval
{
  public static minimum = 0;
  public static maximum = 1;
}

Classes.registerSerializableClass(ZeroToOne);