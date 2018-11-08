/*
  Part of Kosmud

  TEST - a ship.
*/

import { Vector } from "../../Shared/Physics/Vector";
import { PhysicsBody } from "../../Shared/Physics/PhysicsBody";
import { Vehicle } from "../../Shared/Physics/Vehicle";

export class Ship extends Vehicle
{
  public startTurningLeft()
  {
    this.setAngularVelocity(-Math.PI / 30);
  }

  public startTurningRight()
  {
    this.setAngularVelocity(Math.PI / 30);
  }

  public stopTurning()
  {
    this.setAngularVelocity(0);
  }

  public moveForward()
  {
    this.setVelocity(20);
  }

  public moveBackward()
  {
    this.setVelocity(-20);
  }

  public stopMoving()
  {
    this.setVelocity(0);
  }
}