/*
  Part of Kosmud

  Enriched 'number' type.
*/

import { Classes } from "../../Shared/Class/Classes";
import { Serializable } from "../../Shared/Class/Serializable";

export class Number extends Serializable
{
  private internalValue: number;

  constructor(value = 0)
  {
    super();

    this.internalValue = value;
  }

  public static clampValue
  (
    value: number,
    minimum: number,
    maximum: number
  )
  : number
  {
    if (value < minimum)
      return minimum;

    if (value > maximum)
      return maximum;

    return value;
  }

  // ! Throws exception on error.
  protected static validate
  (
    value: number,
    minimum: number,
    maximum: number
  )
  {
    if (value < minimum || value > maximum)
    {
      throw new Error(`Value '${value}' is not in required interval`
        + ` <${minimum}, ${maximum}>`);
    }
  }

  public set value(value: number)
  {
    this.internalValue = value;
  }

  public get value()
  {
    return this.internalValue;
  }

  public atLeast(minimum: number): this
  {
    if (this.internalValue < minimum)
      this.internalValue = minimum;

    return this;
  }

  public atMost(maximum: number): this
  {
    if (this.internalValue > maximum)
      this.internalValue = maximum;

    return this;
  }

  public clampTo(minimum: number, maximum: number): this
  {
    if (this.internalValue < minimum)
      this.internalValue = minimum;

    if (this.internalValue > maximum)
      this.internalValue = maximum;

    return this;
  }
}

Classes.registerSerializableClass(Number);