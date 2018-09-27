/*
  Part of BrutusNEXT

  TEST - a ship.
*/

import {PhysicsBody} from "../../Server/Physics/PhysicsBody";
import * as Shared from "../../Shared/Game/Ship";

export class Ship extends Shared.Ship
{
  constructor(private physicsBody: PhysicsBody)
  {
    super(physicsBody.getPosition());
  }

  public getPosition()
  {
    return this.physicsBody.getPosition();
  }

  public getX()
  {
    return this.physicsBody.getX();
  }

  public getY()
  {
    return this.physicsBody.getY();
  }

  public getAngle()
  {
    return this.physicsBody.getAngle();
  }

  public startTurningLeft()
  {
    this.physicsBody.setAngularVelocity(-Math.PI/300);
  }

  public startTurningRight()
  {
    this.physicsBody.setAngularVelocity(Math.PI/300);
  }

  public stopTurning()
  {
    this.physicsBody.setAngularVelocity(0);
  }

  public moveForward()
  {
    this.physicsBody.setVelocity(10);
  }

  public moveBackward()
  {
    this.physicsBody.setVelocity(-10);
  }

  public stopMoving()
  {
    this.physicsBody.setVelocity(0);
  }
}