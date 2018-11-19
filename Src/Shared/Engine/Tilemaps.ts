/*
  Shared abstract ancestor of Tilemap classes.
*/

import { Physics } from "../../Shared/Physics/Physics";

export namespace Tilemaps
{
  const physicsShapes = new Map<string, Physics.Shape>();

  // ! Throws exception on error.
  export function getPhysicsShape(shapeId: string)
  {
    const shape = physicsShapes.get(shapeId);

    if (shape === undefined)
    {
      throw new Error(`Failed to get physics shape from tilemap`
        + ` because shapeId '${shapeId}' isn't in the list of loaded`
        + ` physics shapes. Make sure you preload the physics shape`
        + ` for this id`);
    }

    return shape;
  }
}
