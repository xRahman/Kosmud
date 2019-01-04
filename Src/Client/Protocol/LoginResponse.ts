/*  Part of Kosmud  */

import { REPORT } from "../../Shared/Log/REPORT";
import { Player } from "../../Client/Game/Player";
import { Zone } from "../../Client/Game/Zone";
import { Connection } from "../../Client/Net/Connection";
import { Scenes } from "../../Client/Engine/Scenes";
import * as Shared from "../../Shared/Protocol/LoginResponse";

export class LoginResponse extends Shared.LoginResponse<Player, Zone>
{
  // ---------------- Public methods --------------------

  // ~ Overrides Packet.process().
  public async process(connection: Connection)
  {
    connection.setPlayer(this.getPlayer());

    await loadFlightScene(this.getZone());

    initBackgroundScene();
    initFlightScene();

    /// TODO: Někde se taky musí volat zone.createPhysicsWorld();

    /// TODO: Co s assetama?
    // this.getAssets()

    /// Tady by asi mělo bejt ještě setnutí stavu GUI, aby se
    /// shownula/hidnula příslušná okna.
  }

  // ---------------- Private methods -------------------
}

// ----------------- Auxiliary Functions ---------------------

/// TODO: Tohle by se dalo přesunout do Scenes.
async function loadFlightScene(zone: Zone)
{
  Scenes.getFlightScene().setZone(zone);

  try
  {
    await Scenes.getFlightScene().load();
  }
  catch (error)
  {
    REPORT(error, `Failed to load flight scene`);
  }
}

/// TODO: Tohle by se dalo přesunout do Scenes.
function initFlightScene()
{
  try
  {
    Scenes.getFlightScene().init();
  }
  catch (error)
  {
    REPORT(error, `Failed to init flight scene`);
  }
}

/// TODO: Tohle by se dalo přesunout do Scenes.
function initBackgroundScene()
{
  try
  {
    Scenes.getBackgroundScene().init();
  }
  catch (error)
  {
    REPORT(error, `Failed to init background scene`);
  }
}

/// TEST
// function fakeCreateZone()
// {
//   const zone = new Zone();

//   zone.createPhysicsWorld();

//   return zone;
// }

// This class is registered in Client/Net/Connection.