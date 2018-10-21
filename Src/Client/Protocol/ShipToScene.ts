/*
  Part of Kosmud

  Notifies the client about a new visible ship.

  (Part of client-server communication protocol.)
*/

import { Renderer } from "Client/Phaser/Renderer";
import { Connection } from "Client/Net/Connection";
import * as Shared from "Shared/Protocol/ShipToScene";

export class ShipToScene extends Shared.ShipToScene
{
  // ---------------- Public methods --------------------

  // ~ Overrides Packet.process().
  public async process(connection: Connection)
  {
    Renderer.getFlightScene().addShip(this);
  }
}

// This class is registered in Client/Net/Connection.