/*
  Provides methods to transform coordinates from Box2D to Phaser and back.
*/

/*
  Note: All transform functions work both ways.
*/

import { Vector } from "../../Shared/Physics/Vector";

type Polygon = Array<{ x: number; y: number }>;

export namespace CoordsTransform
{
  export function transformAngle(angle: number): number
  {
    return -angle;
  }

  export function transformVector({ x, y }: { x: number; y: number }): Vector
  {
    return new Vector({ x, y: -y });
  }

  export function transformPolygon(polygon: Polygon): Polygon
  {
    const result = [];

    for (const point of polygon)
    {
      result.push({ x: point.x, y: -point.y });
    }

    return result;
  }
}