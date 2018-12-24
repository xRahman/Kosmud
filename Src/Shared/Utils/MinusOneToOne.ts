/*
  Part of Kosmud

  Number in <-1, 1> interval.
*/

import { ClassFactory } from "../../Shared/Class/ClassFactory";
import { NumberInInterval } from "../../Shared/Class/NumberInInterval";

export class MinusOneToOne extends NumberInInterval
{
  public static minimum = -1;
  public static maximum = 1;
}

ClassFactory.registerClassPrototype(MinusOneToOne);