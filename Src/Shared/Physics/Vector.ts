/*
  Part of Kosmud

  2D vector.
*/

/*
  Notes:
    Methods called on Vector instance modify the instance.
    Static methods always return a new Vector.
*/

import {b2Vec2} from '../../Shared/Box2D/Box2D';

export class Vector
{
  constructor({ x, y }: { x: number, y: number } = { x: 0, y: 0 })
  {
    this.x = x;
    this.y = y;
  }
  
  public x: number;
  public y: number;

  public set(x: number, y: number): this
  {
    this.x = x;
    this.y = y;

    return this;
  }

  public setZero(): this
  {
    this.x = 0;
    this.y = 0;

    return this;
  }

  public clone(): Vector
  {
    return new Vector(this);
  }

  public cloneToVec2(): b2Vec2
  {
    return new b2Vec2(this.x, this.y);
  }

  public static v1PlusV2
  (
    v1: { x: number, y: number },
    v2: { x: number, y: number }
  )
  : Vector
  {
    return new Vector({ x: v1.x + v2.x, y: v1.y + v2.y });
  }

  public add({ x, y }: { x: number, y: number }): this
  {
    this.x += x;
    this.y += y;

    return this;
  }

  public static v1MinusV2
  (
    v1: { x: number, y: number },
    v2: { x: number, y: number }
  )
  : Vector
  {
    return new Vector({ x: v1.x - v2.x, y: v1.y - v2.y });
  }

  public subtract({ x, y }: { x: number, y: number }): this
  {
    this.x -= x;
    this.y -= y;

    return this;
  }

  public static scale({ x, y }: { x: number, y: number }, value: number)
  {
    return new Vector({ x: x * value, y: y * value });
  }

  public scale(value: number): this
  {
    this.x *= value;
    this.y *= value;
    
    return this;
  }

  public static v1DotV2
  (
    v1: { x: number, y: number },
    v2: { x: number, y: number }
  )
  : number
  {
    return v1.x * v2.x + v1.y * v2.y;
  }

  public dot({ x, y }: { x: number, y: number }): number
  {
    return this.x * x + this.y * y;
  }

  public static v1CrossV2
  (
    v1: { x: number, y: number },
    v2: { x: number, y: number }
  )
  : number
  {
    return v1.x * v2.y - v1.y * v2.x;
  }

  public cross({ x, y }: { x: number, y: number }): number
  {
    return this.x * y - this.y * x;
  }

  public length(): number
  {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  public lengthSquared(): number
  {
    return this.x * this.x + this.y * this.y;
  }

  // Note that zero-length vector stays unchanged after Normalize().
  public normalizeAndRerurnLength(): number
  {
    const length = this.length();

    if (length >= Number.EPSILON)
    {
      this.x /= length;
      this.y /= length;
    }

    return length;
  }

  // Note that zero-length vector stays unchanged after Normalize().
  public normalize(): this
  {
    const length = this.length();

    if (length >= Number.EPSILON)
    {
      this.x /= length;
      this.y /= length;
    }

    return this;
  }

  public static rotate
  (
    { x, y }: { x: number, y: number },
    radians: number
  )
  : Vector
  {
    const cosine: number = Math.cos(radians);
    const sine: number = Math.sin(radians);
    const origX = x;

    return new Vector
    (
      {
        x: cosine * origX - sine * y,
        y: sine * origX + cosine * y
      }
    );
  }

  public rotate(radians: number): this
  {
    const cosine: number = Math.cos(radians);
    const sine: number = Math.sin(radians);
    const x = this.x;

    this.x = cosine * x - sine * this.y;
    this.y = sine * x + cosine * this.y;

    return this;
  }

  public isValid(): boolean
  {
    return isFinite(this.x) && isFinite(this.y);
  }

  public static negate({ x, y }: { x: number, y: number }): Vector
  {
    return new Vector({ x: -x, y: -y });
  }

  public negate(): this
  {
    this.x = (-this.x);
    this.y = (-this.y);

    return this;
  }

  public toJSON()
  {
    return "{ x: " + this.x + ", y: " + this.y + "}";
  }
}