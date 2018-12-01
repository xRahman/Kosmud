/*
  Part of Kosmud

  Number in <min, max> interval.
*/

const MINIMUM = "minimum";
const MAXIMUM = "maximum";

import "../../Shared/Utils/Number";
import { Serializable } from "../../Shared/Class/Serializable";

export abstract class NumberInInterval extends Serializable
{
  public static minimum: number;
  public static maximum: number;

  private value: number;

  constructor(value = 0)
  {
    super();

    const min = (this.constructor as any)[MINIMUM];
    const max = (this.constructor as any)[MAXIMUM];

    if (value < min)
    {
      this.value = min;
    }
    else if (value > max)
    {
      this.value = max;
    }
    else
    {
      this.value = value;
    }
  }

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

  public valueOf(): number
  {
    return this.value;
  }

  // public clamp(value: number): this
  // {
  //   const min = (this.constructor as any)[MINIMUM];
  //   const max = (this.constructor as any)[MAXIMUM];

  //   if (value < min)
  //   {
  //     this.value = min;
  //   }
  //   else if (value > max)
  //   {
  //     this.value = max;
  //   }
  //   else
  //   {
  //     this.value = value;
  //   }

  //   return this;
  // }

  // // ! Throws exception on error.
  // public set value(value: number)
  // {
  //   // ! Throws exception on error.
  //   Number.validate(value, this.minimum, this.maximum);

  //   super.value = value;
  // }

  // public clamp(value: number): this
  // {
  //   super.value = Number.clampValue(value, this.minimum, this.maximum);

  //   return this;
  // }
}

// Classes.registerSerializableClass(IntervalNumber);