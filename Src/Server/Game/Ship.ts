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
  private readonly waypoint: Vector;
  private readonly velocity = new Vector();
  private readonly desiredVelocity = new Vector();
  private readonly steeringForce = new Vector();
  private readonly desiredSteeringForce = new Vector();
  private readonly desiredForwardSteeringForce = new Vector();
  private readonly desiredLeftwardSteeringForce = new Vector();

  constructor(private readonly physicsBody: PhysicsBody)
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
  public getDesiredForwardSteeringForce()
  {
    return this.desiredForwardSteeringForce;
  }
  public getDesiredLeftwardSteeringForce()
  {
    return this.desiredLeftwardSteeringForce;
  }
  public getVelocity() { return this.velocity; }

  public setWaypoint(waypoint: Vector)
  {
    this.waypoint.set(waypoint);
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

    const vehicleVelocity = this.physicsBody.getVelocity();

    const steeringResult = Steering.seek
    (
      this.getPosition(),
      vehicleVelocity,
      this.waypoint,
      this.physicsBody.getRotation()
    );

    /// DEBUG:
    // console.log("Applying steering force"
    //   + " [" + steeringForce.x + ", " + steeringForce.y + "]");

    this.desiredVelocity.set(steeringResult.desiredVelocity);
    this.steeringForce.set(steeringResult.steeringForce);
    this.desiredSteeringForce.set(steeringResult.desiredSteeringForce);
    this.desiredForwardSteeringForce.set
    (
      steeringResult.desiredForwardSteeringForce
    );
    this.desiredLeftwardSteeringForce.set
    (
      steeringResult.desiredLeftwardSteeringForce
    );
    this.velocity.set(vehicleVelocity);

    this.physicsBody.applyForce(this.steeringForce);
    this.physicsBody.setAngularVelocity(steeringResult.angularVelocity);
  }

  public getShape()
  {
    return this.physicsBody.getShape();
  }
}