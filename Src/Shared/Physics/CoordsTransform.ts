/*
  Provides methods to transform coordinates from Box2D to Phaser and back.
*/

/*
  Note: All transform functions work both ways.
*/

import { Physics } from "../../Shared/Physics/Physics";
import { Vector } from "../../Shared/Physics/Vector";

// const SERVER_TO_CLIENT_SCALE = 1000;
const SERVER_TO_CLIENT_SCALE = 1;
const CLIENT_TO_SERVER_SCALE = 1 / SERVER_TO_CLIENT_SCALE;

export namespace CoordsTransform
{
  export namespace ClientToServer
  {
    export function angle(value: number): number
    {
      return -value;
    }

    export function length(value: number): number
    {
      return value * CLIENT_TO_SERVER_SCALE;
    }

    export function vector({ x, y }: { x: number; y: number }): Vector
    {
      return new Vector
      (
        {
          x: x * CLIENT_TO_SERVER_SCALE,
          y: -y * CLIENT_TO_SERVER_SCALE
        }
      );
    }

    export function polygon(points: Physics.Polygon): Physics.Polygon
    {
      const result = [];

      for (const point of points)
      {
        result.push(vector(point));
      }

      return result;
    }

    export function tileObject<T extends { x: number; y: number }>
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

  export namespace ServerToClient
  {
    export function angle(value: number): number
    {
      return -value;
    }

    export function length(value: number): number
    {
      return value * SERVER_TO_CLIENT_SCALE;
    }

    export function vector({ x, y }: { x: number; y: number }): Vector
    {
      return new Vector
      (
        {
          x: x * SERVER_TO_CLIENT_SCALE,
          y: -y * SERVER_TO_CLIENT_SCALE
        }
      );
    }

    export function polygon(points: Physics.Polygon): Physics.Polygon
    {
      const result = [];

      for (const point of points)
      {
        result.push(vector(point));
      }

      return result;
    }
  }
}