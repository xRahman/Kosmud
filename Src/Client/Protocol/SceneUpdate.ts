
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
    // ! Throws exception on error.
    /// TODO: Tohle není mnemotechnické - nejde ani tak o to, jestli
    ///   má connection setnutou zónu, ale jestli jsou už v zóně lodě
    ///   a mají vytvořené modely, aby se jim dala setovat pozice.
    ///     Zóna se teda teď do connection setne právě kvůli tomu na
    ///   konci creatu, ale chtělo by to celý pojmenovat nějak líp
    ///   (isSceneReady?)
    if (connection.hasZoneAssigned())
      connection.getZone().updateShips(this.shipStates);
  }
}

// This class is registered in Client/Net/Connection.