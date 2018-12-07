
/*
  Part of Kosmud

  Description of change of scene contents.

  (Part of client-server communication protocol.)
*/

import { Scenes } from "../../Client/Engine/Scenes";
import { Connection } from "../../Client/Net/Connection";
import * as Shared from "../../Shared/Protocol/ZoneUpdate";

export class ZoneUpdate extends Shared.ZoneUpdate
{
  // ---------------- Public methods --------------------

  // ~ Overrides Packet.process().
  public async process(connection: Connection)
  {
    if (Scenes.getFlightScene().isActive())
      connection.getZone().updateShips(this.shipStates);
  }
}

// This class is registered in Client/Net/Connection.