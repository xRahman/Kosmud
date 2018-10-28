/*
  Part of Kosmud

  2D vector.
*/

/*
  Notes:
    Methods called on Vector instance modify the instance.
    Static methods always return a new Vector.
*/

import { b2Vec2 } from "../../Shared/Box2D/Box2D";

export class Vector
{
  constructor({ x, y }: { x: number; y: number } = { x: 0, y: 0 })
  {
    this.x = x;
    this.y = y;
  }

  public x: number;
  public y: number;

  public set({ x, y }: { x: number; y: number })
  {
    this.x = x;
    this.y = y;
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
    v1: { x: number; y: number },
    v2: { x: number; y: number }
  )
  : Vector
  {
    return new Vector({ x: v1.x + v2.x, y: v1.y + v2.y });
  }

  public add({ x, y }: { x: number; y: number }): this
  {
    this.x += x;
    this.y += y;

    return this;
  }

  public static v1MinusV2
  (
    v1: { x: number; y: number },
    v2: { x: number; y: number }
  )
  : Vector
  {
    return new Vector({ x: v1.x - v2.x, y: v1.y - v2.y });
  }

  public subtract({ x, y }: { x: number; y: number }): this
  {
    this.x -= x;
    this.y -= y;

    return this;
  }

  public static scale({ x, y }: { x: number; y: number }, value: number)
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
    v1: { x: number; y: number },
    v2: { x: number; y: number }
  )
  : number
  {
    return v1.x * v2.x + v1.y * v2.y;
  }

  public dot({ x, y }: { x: number; y: number }): number
  {
    return this.x * x + this.y * y;
  }

  public static v1CrossV2
  (
    v1: { x: number; y: number },
    v2: { x: number; y: number }
  )
  : number
  {
    return v1.x * v2.y - v1.y * v2.x;
  }

  public cross({ x, y }: { x: number; y: number }): number
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
  public normalizeAndReturnLength(): number
  {
    const length = this.length();

    if (length > Number.EPSILON)
    {
      this.x /= length;
      this.y /= length;
    }

    return length;
  }

  // Note that zero-length vector stays unchanged after Normalize().
  public static normalize({ x, y }: { x: number; y: number }): Vector
  {
    return new Vector({ x, y }).normalize();
  }

  // Note that zero-length vector stays unchanged after Normalize().
  public normalize(): this
  {
    const length = this.length();

    if (length > Number.EPSILON)
    {
      this.x /= length;
      this.y /= length;
    }

    return this;
  }

  // Note that this doesn't work for zero-length vectors.
  public setLength(length: number): this
  {
    this.normalize();
    this.scale(length);

    return this;
  }

  public static rotate
  (
    { x, y }: { x: number; y: number },
    angle: number
  )
  : Vector
  {
    const cosine: number = Math.cos(angle);
    const sine: number = Math.sin(angle);
    const origX = x;

    return new Vector
    (
      {
        x: cosine * origX - sine * y,
        y: sine * origX + cosine * y
      }
    );
  }

  public rotate(angle: number): this
  {
    const cosine: number = Math.cos(angle);
    const sine: number = Math.sin(angle);
    const x = this.x;

    this.x = cosine * x - sine * this.y;
    this.y = sine * x + cosine * this.y;

    return this;
  }

  public isValid(): boolean
  {
    return isFinite(this.x) && isFinite(this.y);
  }

  public equals({ x, y }: { x: number; y: number }): boolean
  {
    return Math.abs(this.x - x) <= Number.EPSILON
        && Math.abs(this.y - y) <= Number.EPSILON;
  }

  public static negate({ x, y }: { x: number; y: number }): Vector
  {
    return new Vector({ x: -x, y: -y });
  }

  public negate(): this
  {
    this.x = (-this.x);
    this.y = (-this.y);

    return this;
  }

  // -> Returns number between 0 and 2π.
  public angleToX(): number
  {
    // OMGF Math.atan2 gets 'y' as first argument and 'x' as second.
    // Tell me why, tell me why, tell me why...
    let angle = Math.atan2(this.y, this.x);

    // Convert angle from interval [-π, π] returned by atan2
    // to interval [0, 2π] (because all angles in game are in
    // that interval and comparing angles in different intervals
    // leads to hard-to-debug quirky behaviour).
    if (angle < 0)
      angle += Math.PI * 2;

    return angle;
  }

  public toJSON()
  {
    return { x: this.x, y: this.y };
  }
}