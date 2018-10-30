/*
  Part of Kosmud

  TEST - a ship.
*/

import { Vector } from "../../Shared/Physics/Vector";
import { Steering } from "../../Shared/Physics/Steering";
import { PhysicsBody } from "../../Shared/Physics/PhysicsBody";
import * as Shared from "../../Shared/Game/Ship";

export class Ship extends Shared.Ship
{
  private waypoint: Vector;
  private desiredVelocity = new Vector();
  private steeringForce = new Vector();
  private desiredSteeringForce = new Vector();

  constructor(private physicsBody: PhysicsBody)
  {
    super(physicsBody.getPosition(), physicsBody.getRotation());

    this.waypoint = physicsBody.getPosition();
  }

  public getPosition() {  return this.physicsBody.getPosition(); }

  public getX() { return this.physicsBody.getX(); }
  public getY() { return this.physicsBody.getY(); }
  public getRotation() { return this.physicsBody.getRotation(); }

  public getDesiredVelocity() { return this.desiredVelocity; }
  public getSteeringForce() { return this.steeringForce; }
  public getDesiredSteeringForce() { return this.desiredSteeringForce; }

  public setWaypoint(waypoint: Vector)
  {
    this.waypoint = waypoint;
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

    const steeringResult = Steering.seek
    (
      this.getPosition(),
      this.physicsBody.getVelocity(),
      this.waypoint,
      this.physicsBody.getRotation()
    );

    /// DEBUG:
    // console.log("Applying steering force"
    //   + " [" + steeringForce.x + ", " + steeringForce.y + "]");

    this.desiredVelocity = steeringResult.desiredVelocity;
    this.steeringForce = steeringResult.steeringForce;
    this.desiredSteeringForce = steeringResult.desiredSteeringForce;

    this.physicsBody.applyForce(this.steeringForce);
    this.physicsBody.setAngularVelocity(steeringResult.angularVelocity);
  }

  public getShape()
  {
    return this.physicsBody.getShape();
  }
}