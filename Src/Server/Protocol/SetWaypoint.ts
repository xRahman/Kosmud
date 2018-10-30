/*
  Part of Kosmud

  Incoming request to set player ship waypoint.

  (Part of client-server communication protocol.)
*/

import { Connection } from "../../Server/Net/Connection";
import { Game } from "../../Server/Game/Game";
import * as Shared from "../../Shared/Protocol/SetWaypoint";

export class SetWaypoint extends Shared.SetWaypoint
{
  // ---------------- Public methods --------------------

  // ~ Overrides Packet.process().
  public async process(connection: Connection)
  {
    Game.ship.setWaypoint(this.waypoint);
  }
}

// This class is registered in Server/Net/Connection.