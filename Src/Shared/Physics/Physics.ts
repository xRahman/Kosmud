/*
  Part of Kosmud

  Physics engine wrapper.
*/

import { b2_maxTranslation, b2_maxRotation } from
  "../../Shared/Box2D/Box2D";
import { Engine } from "../../Shared/Engine/Engine";
import { PhysicsWorld } from "../../Shared/Physics/PhysicsWorld";

export namespace Physics
{
  // There is a hardcoded limit to speed in box2d to prevent
  // floating point arithmetics inaccuracies. For us it means
  // that nothing can move faster than this.
  export const MAXIMUM_POSSIBLE_SPEED = b2_maxTranslation * Engine.FPS;
  export const MAXIMUM_POSSIBLE_SPEED_SQUARED =
    MAXIMUM_POSSIBLE_SPEED * MAXIMUM_POSSIBLE_SPEED;

  export const MAXIMUM_POSSIBLE_ANGULAR_VELOCITY = b2_maxRotation * Engine.FPS;
  export const MAXIMUM_POSSIBLE_ANGULAR_VELOCITY_SQUARED =
    MAXIMUM_POSSIBLE_ANGULAR_VELOCITY * MAXIMUM_POSSIBLE_ANGULAR_VELOCITY;

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