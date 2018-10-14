/*
  Part of Kosmud

  Physics engine wrapper.
*/

import {PhysicsBody} from '../../Shared/Physics/PhysicsBody';

// 3rd party modules.
import
{
  b2World, b2Vec2, b2BodyDef, b2Body, b2PolygonShape, b2BodyType, b2FixtureDef
}
from '../../Shared/Box2D/Box2D';

export class Physics
{
  private static gravity = new b2Vec2(0, 0);
  private static world = new b2World(Physics.gravity);

  // constructor()
  // {
  //   /// Test.
  //   const gravity = new b2Vec2(0, 0);

  //   let world = new b2World(gravity);
  // }

  // constructor()
  // {
  //   this.engine = Matter.Engine.create();
  //   this.disableGravity();
  // }

  // private engine: Matter.Engine;

  public tick(miliseconds: number)
  {
    // Matter.Engine.update(this.engine, miliseconds);
  }

  /// Tohle má dělat world.
  // public createBody(x: number, y: number): PhysicsBody
  // {
  //   // /// Prozatím natvrdo čtverec.
  //   // return new PhysicsBody(this.createSquareBody(x, y, 100));
  //   return new PhysicsBody();
  // }

  // /// Only squares atm.
  // private createSquareBody(x: number, y: number, size: number)
  // {
  //   let squareBody = Matter.Bodies.rectangle
  //   (
  //     x,
  //     y,
  //     size,
  //     size,
  //     {
  //       // Nonzero friction would mean that object would slow down
  //       // to stop after velocity is set to it.
  //       frictionAir: 0
  //     }
  //   );

  //   // Add 'squareBody' to physics world.
  //   Matter.World.add(this.engine.world, [ squareBody ]);

  //   return squareBody;
  // }

  // private disableGravity()
  // {
  //   this.engine.world.gravity.y = 0;
  // }
}