/*
  Part of Kosmud

  Part of game universe that fits into one physics world
  (all objects in the same zone can physically influence each other).
*/

import { Entity } from "../../Shared/Class/Entity";
import { Tilemap } from "../../Shared/Engine/Tilemap";
import { Physics } from "../../Shared/Physics/Physics";

export class Zone extends Entity
{
  private readonly tilemaps = new Map<string, Tilemap>();
  private readonly physicsShapes = new Map<string, Physics.Shape>();

  // ---------------- Public methods --------------------

  public preload()
  {
  }

  // ! Throws exception on error.
  public getTilemap(name: string)
  {
    const tilemap = this.tilemaps.get(name);

    if (tilemap === undefined)
    {
      throw new Error(`Failed to find tilemap '${name}' the`
        + ` list of loaded tilemaps in zone ${this.debugId}`);
    }

    return tilemap;
  }

  // ! Throws exception on error.
  public getPhysicsShape(shapeId: string)
  {
    const shape = this.physicsShapes.get(shapeId);

    if (shape === undefined)
    {
      throw new Error(`Failed to find physics shape with id '${shapeId}'`
        + ` in zone ${this.debugId}. Make sure the shape is preloaded`);
    }

    return shape;
  }
}

// ------------------ Type declarations ----------------------

// export namespace Zone
// {
// }