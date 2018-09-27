/*
  Part of BrutusNEXT

  Matter.js physics engine wrapper.
*/

import {GameEntity} from '../../Shared/Game/GameEntity';

import * as Matter from 'matter-js';

export class PhysicsBody
{
  constructor(private body: Matter.Body) {}

  public getPosition()
  {
    let position: GameEntity.Position =
    {
      x: this.getX(),
      y: this.getY(),
      angle: this.getAngle()
    };

    return position;
  }

  public getX()
  {
    return this.body.position.x;
  }

  public getY()
  {
    return this.body.position.y;
  }

  public getAngle()
  {
    return this.body.angle
  }

  public setVelocity(velocity: number)
  {
    this.body.angularVelocity = velocity;
  }

  public setAngularVelocity(velocityRadians: number)
  {
    Matter.Body.setAngularVelocity(this.body, velocityRadians);
  }

  /// TEST.
  public applyForce()
  {
    let force: Matter.Vector = { x: 0.01, y: 0.01 };

    this.body.force = force
  }
}