/*
  Part of Kosmud

  Matter.js physics engine wrapper.
*/

import {GameEntity} from '../../Shared/Game/GameEntity';

import * as Matter from 'matter-js';

export class PhysicsBody
{
  constructor(private body: Matter.Body) {}

  // Scalar value of velocity.
  private velocity = 0;

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
    this.velocity = velocity;

    this.updateVelocityDirection();
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

  private getVelocityVector(velocity: number): Matter.Vector
  {
    let velocityVector =
    {
      x: velocity * Math.cos(this.body.angle),
      y: velocity * Math.sin(this.body.angle)
    }

    return velocityVector;
  }

  public updateVelocityDirection()
  {
    Matter.Body.setVelocity(this.body, this.getVelocityVector(this.velocity));
  }
}