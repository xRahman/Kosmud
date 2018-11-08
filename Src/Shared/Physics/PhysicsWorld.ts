/*
  Part of Kosmud

  Physics World.
*/

import { PhysicsBody } from "../../Shared/Physics/PhysicsBody";

// 3rd party modules.
import { b2World, b2Vec2, b2BodyDef, b2Body, b2PolygonShape, b2BodyType,
  b2FixtureDef } from "../../Shared/Box2D/Box2D";

/// Test.
const GRAVITY = new b2Vec2(0, 0);

export namespace PhysicsWorld
{
  const world = new b2World(GRAVITY);

  export function createBody(): PhysicsBody
  {
    return new PhysicsBody(world);
  }

  export function tick(miliseconds: number)
  {
    world.Step(miliseconds / 1000, 6, 2);
  }
}