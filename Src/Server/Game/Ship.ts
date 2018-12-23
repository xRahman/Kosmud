/*
  Part of Kosmud

  TEST - a ship.
*/

import { ZoneUpdate } from "../../Shared/Protocol/ZoneUpdate";
import * as Shared from "../../Shared/Game/Ship";

export class Ship extends Shared.Ship
{
  // ---------------- Public methods --------------------

  public getStateUpdate(): ZoneUpdate.ShipState
  {
    const shipState: ZoneUpdate.ShipState =
    {
      shipId: this.getId(),
      shipPosition: this.physics.getPosition(),
      shipRotation: this.physics.getRotation().valueOf(),
      shipVelocity: this.physics.getVelocity(),
      desiredVelocity: this.physics.getDesiredVelocity(),
      steeringForce: this.physics.getSteeringForce(),
      // desiredSteeringForce: this.physics.getDesiredSteeringForce(),
      // desiredForwardSteeringForce:
      //   this.physics.getDesiredForwardSteeringForce(),
      // desiredLeftwardSteeringForce:
      //   this.physics.getDesiredLeftwardSteeringForce(),
      forwardThrustRatio: this.physics.getForwardThrustRatio(),
      leftwardThrustRatio: this.physics.getLeftwardThrustRatio(),
      torqueRatio: this.physics.getTorqueRatio(),
      brakingDistance: this.physics.brakingDistance,
      // stoppingDistance: this.physics.stoppingDistance,
      // desiredRotation: this.physics.desiredRotation.valueOf()
    };

    return shipState;
  }

  // public getInitialState()
  // {
  //   const state =
  //   {
  //     shape: this.getShape(),
  //     position: this.getPosition(),
  //     rotation: this.getRotation()
  //   };

  //   return state;
  // }

  // public startTurningLeft()
  // {
  //   this.setAngularVelocity(-Math.PI / 30);
  // }

  // public startTurningRight()
  // {
  //   this.setAngularVelocity(Math.PI / 30);
  // }

  // public stopTurning()
  // {
  //   this.setAngularVelocity(0);
  // }

  // public moveForward()
  // {
  //   this.setVelocity(20);
  // }

  // public moveBackward()
  // {
  //   this.setVelocity(-20);
  // }

  // public stopMoving()
  // {
  //   this.setVelocity(0);
  // }
}