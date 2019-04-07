/*  Part of Kosmud  */

// import { MinusOneToOne } from "../../Shared/Utils/MinusOneToOne";
import { Vehicle } from "../../Shared/Game/Vehicle";
import { Packet } from "../../Shared/Protocol/Packet";
// import { Vector } from "../../Shared/Physics/Vector";

export class ZoneUpdate extends Packet
{
  public vehicles = new Set<Vehicle>();

  // ! Throws exception on error.
  public addVehicle(vehicle: Vehicle)
  {
    if (!vehicle.isValid())
    {
      throw Error(`Attempt to add invalid vehicle ${vehicle.debugId}`
        + ` to zone update packet`);
    }

    if (this.vehicles.has(vehicle))
    {
      throw Error(`Attempt to add vehicle ${vehicle.debugId} to zone`
        + ` update packet which already has it`);
    }

    this.vehicles.add(this.addEntity(vehicle));
  }

  // public shipStates: Array<ZoneUpdate.ShipState> = [];

  // constructor(shipStates: Array<ZoneUpdate.ShipState>)
  // {
  //   super();

  //   this.shipStates = shipStates;
  // }

  // constructor(public shipStates: Array<ZoneUpdate.ShipState> = [])
  // {
  //   super();
  // }
}

// ------------------ Type Declarations ----------------------

// export namespace ZoneUpdate
// {
//   export interface ShipState
//   {
//     shipId: string;
//     shipPosition: Vector;
//     shipRotation: number;
//     shipVelocity: Vector;
//     desiredVelocity: Vector;
//     steeringForce: Vector;
//     // desiredSteeringForce: Vector;
//     // desiredForwardSteeringForce: Vector;
//     // desiredLeftwardSteeringForce: Vector;
//     forwardThrustRatio: number;
//     leftwardThrustRatio: number;
//     torqueRatio: number;
//     // brakingDistance: number;
//     // stoppingDistance: number;
//     // desiredRotation: number;
//   }
// }
