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
  protected vehiclePhysics = new VehiclePhysics();

  // ---------------- Public methods --------------------

  // ~ Overrides Entity.onInstantiation()
  // This method is called when the entity is instantiated.
  public onInstantiation()
  {
    super.onInstantiation();

    this.vehiclePhysics.setVehicle(this);
  }

  public get physics() { return this.vehiclePhysics; }

  // ! Throws exception on error.
  public addToPhysicsWorld(physicsWorld: PhysicsWorld, zone: Zone)
  {
    this.vehiclePhysics.addToPhysicsWorld(physicsWorld, zone);
  }

  // ! Throws exception on error.
  public steer()
  {
    // ! Throws exception on error.
    this.vehiclePhysics.steer();
  }
}