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
    const shipState: SceneUpdate.ShipState =
    {
      shipId: this.getId(),
      shipPosition: this.physics.getPosition(),
      shipRotation: this.physics.getRotation(),
      shipVelocity: this.physics.getVelocity(),
      desiredVelocity: this.physics.getDesiredVelocity(),
      steeringForce: this.physics.getSteeringForce(),
      desiredSteeringForce: this.physics.getDesiredSteeringForce(),
      desiredForwardSteeringForce:
        this.physics.getDesiredForwardSteeringForce(),
      desiredLeftwardSteeringForce:
        this.physics.getDesiredLeftwardSteeringForce(),
      forwardThrustRatio: this.physics.getForwardThrustRatio(),
      leftwardThrustRatio: this.physics.getLeftwardThrustRatio(),
      torqueRatio: this.physics.getTorqueRatio()
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