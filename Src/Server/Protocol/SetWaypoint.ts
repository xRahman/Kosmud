/*
  Part of Kosmud

  Incoming request to set player ship waypoint.

  (Part of client-server communication protocol.)
*/

import { Connection } from "../../Server/Net/Connection";
import * as Shared from "../../Shared/Protocol/SetWaypoint";

export class SetWaypoint extends Shared.SetWaypoint
{
  // ---------------- Public methods --------------------

  // ! Throws exception on error.
  // ~ Overrides Packet.process().
  public async process(connection: Connection)
  {
    // ! Throws exception on error.
    connection.getPlayer().getActiveShip().physics.setWaypoint(this.waypoint);
  }
}

// This class is registered in Server/Net/Connection.