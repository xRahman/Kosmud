/*
  Part of Kosmud

  Number in <-1, 1> interval.
*/

import { Classes } from "../../Shared/Class/Classes";
import { NumberInInterval } from "../../Shared/Class/NumberInInterval";

export class MinusOneToOne extends NumberInInterval
{
  public static minimum = -1;
  public static maximum = 1;
}

Classes.registerSerializableClass(MinusOneToOne);