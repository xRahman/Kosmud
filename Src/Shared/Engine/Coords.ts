/*
  Part of Kosmud

  Transforms coordinates from Box2D to Phaser and back.
*/

import { Physics } from "../../Shared/Physics/Physics";
import { Vector } from "../../Shared/Physics/Vector";

const SERVER_TO_CLIENT_RATIO = 100;
const CLIENT_TO_SERVER_RATIO = 1 / SERVER_TO_CLIENT_RATIO;

export namespace Coords
{
  export namespace ClientToServer
  {
    export function angle(value: number): number
    {
      return -value;
    }

    export function distance(value: number): number
    {
      return transformDistance(value, CLIENT_TO_SERVER_RATIO);
    }

    export function vector(value: { x: number; y: number }): Vector
    {
      return transformVector(value, CLIENT_TO_SERVER_RATIO);
    }

    export function polygon(points: Physics.Polygon): Physics.Polygon
    {
      return transformPolygon(points, CLIENT_TO_SERVER_RATIO);
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

    export function distance(value: number): number
    {
      return transformDistance(value, SERVER_TO_CLIENT_RATIO);
    }

    export function vector(value: { x: number; y: number }): Vector
    {
      return transformVector(value, SERVER_TO_CLIENT_RATIO);
    }

    export function polygon(points: Physics.Polygon): Physics.Polygon
    {
      return transformPolygon(points, SERVER_TO_CLIENT_RATIO);
    }
  }
}

// ----------------- Auxiliary Functions ---------------------

function transformDistance(value: number, ratio: number): number
{
  return value * ratio;
}

function transformVector({ x, y }: { x: number; y: number }, ratio: number)
{
  return new Vector
  (
    {
      x: x * ratio,
      y: -y * ratio
    }
  );
}

function transformPolygon(points: Physics.Polygon, ratio: number)
{
  const result = [];

  for (const point of points)
  {
    result.push(transformVector(point, ratio));
  }

  return result;
}