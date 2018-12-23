/*
  Part of Kosmud

  Description of change of scene contents.

  (Part of client-server communication protocol.)
*/

import { MinusOneToOne } from "../../Shared/Utils/MinusOneToOne";
import { Packet } from "../../Shared/Protocol/Packet";
import { Vector } from "../../Shared/Physics/Vector";

export class ZoneUpdate extends Packet
{
  // public shipStates: Array<ZoneUpdate.ShipState> = [];

  // constructor(shipStates: Array<ZoneUpdate.ShipState>)
  // {
  //   super();

  //   this.shipStates = shipStates;
  // }

  constructor(public shipStates: Array<ZoneUpdate.ShipState> = [])
  {
    super();
  }
}

// ------------------ Type Declarations ----------------------

export namespace ZoneUpdate
{
  export interface ShipState
  {
    shipId: string;
    shipPosition: Vector;
    shipRotation: number;
    shipVelocity: Vector;
    desiredVelocity: Vector;
    steeringForce: Vector;
    // desiredSteeringForce: Vector;
    // desiredForwardSteeringForce: Vector;
    // desiredLeftwardSteeringForce: Vector;
    forwardThrustRatio: number;
    leftwardThrustRatio: number;
    torqueRatio: number;
    // brakingDistance: number;
    // stoppingDistance: number;
    // desiredRotation: number;
  }
}
