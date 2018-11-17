/*
  Part of Kosmud

  TEST - a ship.
*/

import * as Shared from "../../Shared/Game/Ship";

export class Ship extends Shared.Ship
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