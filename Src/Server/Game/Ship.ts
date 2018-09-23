/*
  Part of BrutusNEXT

  TEST - a ship.
*/

import {PhysicsBody} from "./PhysicsBody";

import * as Matter from 'matter-js';

export class Ship
{
  constructor(private physicsBody: PhysicsBody) {}

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
    this.physicsBody.setAngularVelocity(-Math.PI/12);
  }

  public startTurningRight()
  {
    this.physicsBody.setAngularVelocity(Math.PI/12);
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