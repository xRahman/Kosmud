
/*
  Part of Kosmud

  Description of change of scene contents.

  (Part of client-server communication protocol.)
*/

import { Renderer } from "../../Client/Engine/Renderer";
import { Connection } from "../../Client/Net/Connection";
import * as Shared from "../../Shared/Protocol/SceneUpdate";

export class SceneUpdate extends Shared.SceneUpdate
{
  // ---------------- Public methods --------------------

  // ~ Overrides Packet.process().
  public async process(connection: Connection)
  {
    /// DEBUG:
    console.log(this);

    /// If there are no ships in the zone, do nothing.
    if (this.shipStates.length === 0)
      return;

    /// TODO: Odhackovat:
    const shipState = this.shipStates[0];
    const ship = Renderer.flightScene.getShip();

    if (ship !== "Doesn't exist")
    {
      ship.setPosition(shipState.shipPosition);
      ship.setRotation(shipState.shipRotation);

      ship.setVectors(shipState);

      ship.updateExhausts
      (
        shipState.forwardThrustRatio,
        shipState.leftwardThrustRatio,
        shipState.torqueRatio
      );
    }
  }
}

// This class is registered in Client/Net/Connection.