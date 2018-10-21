/*
  Part of Kosmud

  TEST - a ship.
*/

import { Vector } from "Shared/Physics/Vector";
import { Steering } from "Shared/Physics/Steering";
import { PhysicsBody } from "Shared/Physics/PhysicsBody";
import * as Shared from "Shared/Game/Ship";

export class Ship extends Shared.Ship
{
  private targetPosition: Vector;

  constructor(private physicsBody: PhysicsBody)
  {
    super(physicsBody.getPosition(), physicsBody.getAngle());

    this.targetPosition = physicsBody.getPosition();
  }

  public getPosition()
  {
    return this.physicsBody.getPosition();
  }

  public getAngle()
  {
    return this.physicsBody.getAngle();
  }

  public getX()
  {
    return this.physicsBody.getX();
  }

  public getY()
  {
    return this.physicsBody.getY();
  }

  public seekPosition(position: Vector)
  {
    this.targetPosition = position;
  }

  public startTurningLeft()
  {
    this.physicsBody.setAngularVelocity(-Math.PI / 30);
  }

  public startTurningRight()
  {
    this.physicsBody.setAngularVelocity(Math.PI / 30);
  }

  public stopTurning()
  {
    this.physicsBody.setAngularVelocity(0);
  }

  public moveForward()
  {
    this.physicsBody.setVelocity(20);
  }

  public moveBackward()
  {
    this.physicsBody.setVelocity(-20);
  }

  public stopMoving()
  {
    this.physicsBody.setVelocity(0);
  }

  public updateVelocityDirection()
  {
    this.physicsBody.updateVelocityDirection();
  }

  public steer()
  {
    /// DEBUG:
    // console.log("Steering to position"
    //   + " [" + this.targetPosition.x + ", " + this.targetPosition.y + "]");

    const steeringForce = Steering.seek
    (
      this.getPosition(),
      this.physicsBody.getVelocity(),
      this.targetPosition
    );

    /// DEBUG:
    // console.log("Applying steering force"
    //   + " [" + steeringForce.x + ", " + steeringForce.y + "]");

    this.physicsBody.applyForce(steeringForce);
  }

  public getGeometry()
  {
    return this.physicsBody.getGeometry();
  }
}