/*  Part of Kosmud  */

import { Connection } from "../../Server/Net/Connection";
// import { Game } from "../../Server/Game/Game";
import * as Shared from "../../Shared/Protocol/MouseInput";

export class MouseInput extends Shared.MouseInput
{
  // ---------------- Public methods --------------------

  // ~ Overrides Packet.process().
  public async process(connection: Connection)
  {
    // Game.ship.setWaypoint(this.mousePosition);
  }
}

// This class is registered in Server/Net/Connection.