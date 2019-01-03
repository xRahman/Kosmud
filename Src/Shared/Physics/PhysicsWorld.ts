/*
  Part of Kosmud

  Wraps Box2d physics world.
*/

import { PhysicsBody } from "../../Shared/Physics/PhysicsBody";

// 3rd party modules.
import { b2World, b2Vec2 } from "../../Shared/Box2D/Box2D";
import { Entity } from "../Class/Entity";
import { VehiclePhysics } from "./VehiclePhysics";
import { Physics } from "./Physics";

const VELOCITY_ITERATIONS = 6;
const PARTICLE_ITERATIONS = 2;
const GRAVITY = new b2Vec2(0, 0);

export class PhysicsWorld
{

  private readonly box2dWorld = new b2World(GRAVITY);

  public createPhysicsBody
  (
    entity: Entity,
    entityPhysics: VehiclePhysics,
    physicsShape: Physics.Shape
  )
  {
    return new PhysicsBody
    (
      entity, this.box2dWorld, entityPhysics, physicsShape
    );
  }

  public update(miliseconds: number)
  {
    const seconds = miliseconds / 1000;

    this.box2dWorld.Step(seconds, VELOCITY_ITERATIONS, PARTICLE_ITERATIONS);
    // This probably isn't needed in typescript version of Box2d...
    // this.box2dWorld.ClearForces();
  }
}