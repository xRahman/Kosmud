/*
  Part of Kosmud

  Abstract ancestor of number-wrapping classes.
*/

import { Serializable } from "../../Shared/Class/Serializable";

export abstract class NumberWrapper extends Serializable
{
  protected value = 0;

  public valueOf(): number
  {
    return this.value;
  }
}