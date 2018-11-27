
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
    if (Renderer.isFlightSceneActive())
      connection.getZone().updateShips(this.shipStates);
  }
}

// This class is registered in Client/Net/Connection.