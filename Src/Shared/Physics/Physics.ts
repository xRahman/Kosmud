/*
  Part of Kosmud

  Planck.js physics engine wrapper.
*/

import {PhysicsBody} from '../../Server/Physics/PhysicsBody';

// 3rd party modules.
import * as Planck from 'planck-js';


export class Physics
{
  constructor()
  {
    let world = new Planck.World
    (
      {
        gravity: Vec2(0, 0)
      }
    );
  }

  // constructor()
  // {
  //   this.engine = Matter.Engine.create();
  //   this.disableGravity();
  // }

  // private engine: Matter.Engine;

  // public tick(miliseconds: number)
  // {
  //   Matter.Engine.update(this.engine, miliseconds);
  // }

  // public createBody(x: number, y: number): PhysicsBody
  // {
  //   /// Prozatím natvrdo čtverec.
  //   return new PhysicsBody(this.createSquareBody(x, y, 100));
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