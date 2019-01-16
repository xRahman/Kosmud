/*
  Part of Kosmud

  Autonomous vehicle.
*/

// import { Zone } from "../../Shared/Game/Zone";
import { PhysicsEntity } from "../../Shared/Game/PhysicsEntity";
import { VehiclePhysics } from "../../Shared/Physics/VehiclePhysics";

export abstract class Vehicle extends PhysicsEntity
{
  // ~ Overrides PhysicsEntity.physics.
  public readonly physics = new VehiclePhysics();

  // ---------------- Public methods --------------------

  // ! Throws exception on error.
  public steer()
  {
    // ! Throws exception on error.
    this.physics.steer();
  }
}