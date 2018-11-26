/*
  Part of Kosmud

  TEST - a ship.
*/

import { SceneUpdate } from "../../Shared/Protocol/SceneUpdate";
import * as Shared from "../../Shared/Game/Ship";

export class Ship extends Shared.Ship
{
  // ---------------- Public methods --------------------

  public getStateUpdate(): SceneUpdate.ShipState
  {
    const shipState =
    {
      shipId: this.getId(),
      shipPosition: this.getPosition(),
      shipRotation: this.getRotation(),
      shipVelocity: this.getVelocity(),
      desiredVelocity: this.getDesiredVelocity(),
      steeringForce: this.getSteeringForce(),
      desiredSteeringForce: this.getDesiredSteeringForce(),
      desiredForwardSteeringForce: this.getDesiredForwardSteeringForce(),
      desiredLeftwardSteeringForce: this.getDesiredLeftwardSteeringForce(),
      forwardThrustRatio: this.getForwardThrustRatio(),
      leftwardThrustRatio: this.getLeftwardThrustRatio(),
      torqueRatio: this.getTorqueRatio()
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