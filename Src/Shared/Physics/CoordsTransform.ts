/*
  Provides methods to transform coordinates from Box2D to Phaser and back.
*/

/*
  Note: All transform functions work both ways.
*/

import { Tilemap } from "../../Shared/Engine/Tilemap";
import { Physics } from "../../Shared/Physics/Physics";
import { Vector } from "../../Shared/Physics/Vector";

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

  export function transformPolygon(polygon: Physics.Polygon): Physics.Polygon
  {
    const result = [];

    for (const point of polygon)
    {
      result.push({ x: point.x, y: -point.y });
    }

    return result;
  }

  export function transformTileObject<T extends { x: number; y: number }>
  (
    object: T,
    tileWidth: number,
    tileHeight: number
  )
  {
    // Translate by half the tile size because tiles in Tiled
    // editor have their origin at top left  but sprites in
    // Phaser engine have their origin  in the middle.
    object.x -= tileWidth / 2;
    object.y -= tileHeight / 2;

    return object;
  }
}