/*
  Part of Kosmud

  Physics World.
*/

import { PhysicsBody } from "../../Shared/Physics/PhysicsBody";

// 3rd party modules.
import { b2World, b2Vec2, b2BodyDef, b2Body, b2PolygonShape, b2BodyType,
  b2FixtureDef } from "../../Shared/Box2D/Box2D";

export namespace PhysicsWorld
{
  const GRAVITY = new b2Vec2(0, 0);

  const world = new b2World(GRAVITY);

  // // ! Throws exception on error.
  // export function createBody(config: PhysicsBody.Config): PhysicsBody
  // {
  //   // ! Throws exception on error.
  //   return new PhysicsBody(world, config);
  // }

  export function tick(miliseconds: number)
  {
    world.Step(miliseconds / 1000, 6, 2);
  }
}