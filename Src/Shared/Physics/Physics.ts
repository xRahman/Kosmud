/*
  Part of Kosmud

  Physics engine wrapper.
*/

// import {PhysicsBody} from 'Shared/Physics/PhysicsBody';
import { PhysicsWorld } from "../../Shared/Physics/PhysicsWorld";

// 3rd party modules.
// import { b2World, b2Vec2, b2BodyDef, b2Body, b2PolygonShape, b2BodyType,
//          b2FixtureDef } from "../../Shared/Box2D/Box2D";

export namespace Physics
{
  export type Polygon = Array<{ x: number; y: number }>;

  export type Shape = Array<Polygon>;

  /// Výhledově nejspíš bude physics worldů víc,
  /// takže si tu zatím to provolávání nechám.
  export function tick(miliseconds: number)
  {
    PhysicsWorld.tick(miliseconds);
  }
}