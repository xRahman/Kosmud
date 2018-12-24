/*
  Part of Kosmud

  Number in <0, 1> interval.
*/

import { ClassFactory } from "../../Shared/Class/ClassFactory";
import { NumberInInterval } from "../../Shared/Class/NumberInInterval";

export class ZeroToOne extends NumberInInterval
{
  public static minimum = 0;
  public static maximum = 1;
}

ClassFactory.registerClassPrototype(ZeroToOne);