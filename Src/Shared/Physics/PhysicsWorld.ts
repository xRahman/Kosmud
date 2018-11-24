/*
  Part of Kosmud

  Physics World.
*/

import { Zone } from "../../Shared/Game/Zone";
import { PhysicsBody } from "../../Shared/Physics/PhysicsBody";

// 3rd party modules.
import { b2World, b2Vec2, b2BodyDef, b2Body, b2PolygonShape, b2BodyType,
  b2FixtureDef } from "../../Shared/Box2D/Box2D";

const VELOCIT_ITERATIONS = 6;
const PARTICLE_ITERATIONS = 2;
const GRAVITY = new b2Vec2(0, 0);

export class PhysicsWorld
{

  private readonly world = new b2World(GRAVITY);

  // // ! Throws exception on error.
  // export function createBody(config: PhysicsBody.Config): PhysicsBody
  // {
  //   // ! Throws exception on error.
  //   return new PhysicsBody(world, config);
  // }

  public add(physicsBody: PhysicsBody, zone: Zone)
  {
    physicsBody.create(this.world, zone);
  }

  public tick(miliseconds: number)
  {
    const seconds = miliseconds / 1000;

    this.world.Step(seconds, VELOCIT_ITERATIONS, PARTICLE_ITERATIONS);
  }
}