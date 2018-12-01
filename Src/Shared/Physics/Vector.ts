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
  public x: number;
  public y: number;

  constructor({ x, y }: { x: number; y: number } = { x: 0, y: 0 })
  {
    this.x = x;
    this.y = y;
  }

  // ------------- Public static methods ----------------

  public static v1PlusV2
  (
    v1: { x: number; y: number },
    v2: { x: number; y: number }
  )
  : Vector
  {
    return new Vector({ x: v1.x + v2.x, y: v1.y + v2.y });
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

  public static scale({ x, y }: { x: number; y: number }, value: number)
  {
    return new Vector({ x: x * value, y: y * value });
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

  public static v1CrossV2
  (
    v1: { x: number; y: number },
    v2: { x: number; y: number }
  )
  : number
  {
    return v1.x * v2.y - v1.y * v2.x;
  }

  // Note that zero-length vector stays unchanged after Normalize().
  public static normalize({ x, y }: { x: number; y: number }): Vector
  {
    return new Vector({ x, y }).normalize();
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

  public static negate({ x, y }: { x: number; y: number }): Vector
  {
    return new Vector({ x: -x, y: -y });
  }

  public static isValid({ x, y }: { x: number; y: number }): boolean
  {
    return Number(x).isValid() && Number(y).isValid();
  }

  // ! Throws exception on error.
  public static validate({ x, y }: { x: number; y: number })
  : { x: number; y: number }
  {
    if (!Number(x).isValid())
      throw new Error(`Invalid 'x' in vector: ${x}`);

    if (!Number(y).isValid())
      throw new Error(`Invalid 'y' in vector: ${y}`);

    return { x, y };
  }

  // ---------------- Public methods --------------------

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

  public add({ x, y }: { x: number; y: number }): this
  {
    this.x += x;
    this.y += y;

    return this;
  }

  public subtract({ x, y }: { x: number; y: number }): this
  {
    this.x -= x;
    this.y -= y;

    return this;
  }

  public scale(value: number): this
  {
    this.x *= value;
    this.y *= value;

    return this;
  }

  public dot({ x, y }: { x: number; y: number }): number
  {
    return this.x * x + this.y * y;
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
    return Number(this.x).isValid() && Number(this.y).isValid();
  }

  // ! Throws exception on error.
  public validate(): this
  {
    if (!Number(this.x).isValid())
      throw new Error(`Invalid 'x' in vector: ${this.x}`);

    if (!Number(this.y).isValid())
      throw new Error(`Invalid 'y' in vector: ${this.y}`);

    return this;
  }

  public equals({ x, y }: { x: number; y: number }): boolean
  {
    return Math.abs(this.x - x) <= Number.EPSILON
        && Math.abs(this.y - y) <= Number.EPSILON;
  }

  public negate(): this
  {
    this.x = (-this.x);
    this.y = (-this.y);

    return this;
  }

  // -> Returns angle between vector and 'x' axis (between 0 and 2π).
  public getRotation(): number
  {
    // OMGF Math.atan2 gets 'y' as first argument and 'x' as second.
    // Tell me why, tell me why, tell me why...
    let rotation = Math.atan2(this.y, this.x);

    // Convert angle from interval [-π, π] returned by atan2
    // to interval [0, 2π] (because all rotations in game are in
    // that interval and comparing angles in different intervals
    // leads to hard-to-debug quirky behaviour).
    if (rotation < 0)
      rotation += Math.PI * 2;

    return rotation;
  }

  public toJSON()
  {
    return { x: this.x, y: this.y };
  }
}