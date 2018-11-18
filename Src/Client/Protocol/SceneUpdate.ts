
/*
  Part of Kosmud

  Description of change of scene contents.

  (Part of client-server communication protocol.)
*/

import { Renderer } from "../../Client/Phaser/Renderer";
import { Connection } from "../../Client/Net/Connection";
import * as Shared from "../../Shared/Protocol/SceneUpdate";

export class SceneUpdate extends Shared.SceneUpdate
{
  // ---------------- Public methods --------------------

  // ~ Overrides Packet.process().
  public async process(connection: Connection)
  {
    /// TODO: Odhackovat:
    const shipState = this.shipStates[0];
    const ship = Renderer.getFlightScene().getShip();

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