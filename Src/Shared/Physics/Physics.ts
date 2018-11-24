/*
  Part of Kosmud

  Physics engine wrapper.
*/

import { PhysicsWorld } from "../../Shared/Physics/PhysicsWorld";

export namespace Physics
{
  export type Polygon = Array<{ x: number; y: number }>;

  export type Shape = Array<Polygon>;

  const physicsWorlds = new Set<PhysicsWorld>();

  export function createWorld()
  {
    const physicsWorld = new PhysicsWorld();

    physicsWorlds.add(physicsWorld);

    return physicsWorld;
  }

  export function tick(miliseconds: number)
  {
    for (const physicsWorld of physicsWorlds)
    {
      physicsWorld.tick(miliseconds);
    }
  }
}