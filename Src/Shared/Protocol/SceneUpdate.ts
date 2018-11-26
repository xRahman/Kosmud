/*
  Part of Kosmud

  Description of change of scene contents.

  (Part of client-server communication protocol.)
*/

import { Packet } from "../../Shared/Protocol/Packet";
import { Vector } from "../../Shared/Physics/Vector";

export class SceneUpdate extends Packet
{
  // public shipStates: Array<SceneUpdate.ShipState> = [];

  // constructor(shipStates: Array<SceneUpdate.ShipState>)
  // {
  //   super();

  //   this.shipStates = shipStates;
  // }

  constructor(public shipStates: Array<SceneUpdate.ShipState> = [])
  {
    super();
  }
}

// ------------------ Type Declarations ----------------------

export namespace SceneUpdate
{
  export interface ShipState
  {
    shipId: string;
    shipPosition: Vector;
    shipRotation: number;
    shipVelocity: Vector;
    desiredVelocity: Vector;
    steeringForce: Vector;
    desiredSteeringForce: Vector;
    desiredForwardSteeringForce: Vector;
    desiredLeftwardSteeringForce: Vector;
    forwardThrustRatio: number;
    leftwardThrustRatio: number;
    torqueRatio: number;
  }
}
