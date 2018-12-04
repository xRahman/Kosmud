/*
  Part of Kosmud

  Autonomous vehicle.
*/

import { PhysicsWorld } from "../../Shared/Physics/PhysicsWorld";
import { Zone } from "../../Shared/Game/Zone";
import { GameEntity } from "../../Shared/Game/GameEntity";
import { VehiclePhysics } from "../../Shared/Physics/VehiclePhysics";

export abstract class Vehicle extends GameEntity
{
  protected vehiclePhysics = new VehiclePhysics(this);

  // ---------------- Public methods --------------------

  public get physics() { return this.vehiclePhysics; }

  // ! Throws exception on error.
  public addToPhysicsWorld(physicsWorld: PhysicsWorld, zone: Zone)
  {
    this.vehiclePhysics.addToPhysicsWorld(physicsWorld, zone);
  }

  // ! Throws exception on error.
  // tslint:disable-next-line:prefer-function-over-method
  public steer()
  {
    // ! Throws exception on error.
    // this.vehiclePhysics.steer();
    console.log
    (
      `Force:`,
      this.physics.getForce(),
      `Velocity:`,
      this.physics.getVelocity()
    );

    /// Steering TEST:
    this.physics.applyForce({ x: 10, y: 0 });
  }
}