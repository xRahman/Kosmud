/*
  Part of Kosmud

  Number in <min, max> interval.
*/

const MINIMUM = "minimum";
const MAXIMUM = "maximum";

import { Serializable } from "../../Shared/Class/Serializable";

export abstract class NumberInInterval extends Serializable
{
  public static minimum: number;
  public static maximum: number;

  private value: number;

  constructor(value: number)
  {
    super();

    this.value = this.clampValue(value);
  }

  // ---------------- Public methods --------------------

  // ! Throws exception on error.
  public atLeast(minimum: number): this
  {
    const min = (this.constructor as any)[MINIMUM];
    const max = (this.constructor as any)[MAXIMUM];

    if (minimum > max)
    {
      throw new Error(`Invalid minimum value '${minimum}' requested`
        + ` from interval <${min}, ${max}>`);
    }

    if (this.value < minimum)
      this.value = minimum;

    return this;
  }

  // ! Throws exception on error.
  public atMost(maximum: number): this
  {
    const min = (this.constructor as any)[MINIMUM];
    const max = (this.constructor as any)[MAXIMUM];

    if (maximum < min)
    {
      throw new Error(`Invalid maximum value '${maximum}' requested`
        + ` from interval <${min}, ${max}>`);
    }

    if (this.value > maximum)
      this.value = maximum;

    return this;
  }

  public set(value: number)
  {
    const min = (this.constructor as any)[MINIMUM];
    const max = (this.constructor as any)[MAXIMUM];

    if (value < min || value > max)
    {
      throw new Error(`Attempt to set invalid value (${value})`
        + ` to interval <${min}, ${max}>`);
    }
  }

  public clamp(value: number)
  {
    this.value = this.clampValue(value);
  }

  public valueOf(): number
  {
    return this.value;
  }

  // ---------------- Private methods -------------------

  private clampValue(value: number)
  {
    const min = (this.constructor as any)[MINIMUM];
    const max = (this.constructor as any)[MAXIMUM];

    if (value < min)
      return min;

    if (value > max)
      return max;

    return value;
  }
}