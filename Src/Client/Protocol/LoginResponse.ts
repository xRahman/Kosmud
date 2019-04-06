/*  Part of Kosmud  */

import { REPORT } from "../../Shared/Log/REPORT";
import { Player } from "../../Client/Game/Player";
import { Zone } from "../../Client/Game/Zone";
import { Asset } from "../../Client/Asset/Asset";
import { Connection } from "../../Client/Net/Connection";
import { Scenes } from "../../Client/Engine/Scenes";
import * as Shared from "../../Shared/Protocol/LoginResponse";

export class LoginResponse
  extends Shared.LoginResponse<Player, Zone, Asset>
{
  // ---------------- Public methods --------------------

  // ~ Overrides Packet.process().
  public async process(connection: Connection)
  {
    connection.setPlayer(this.getPlayer());

    // this.initAssets();

    if (this.hasZone())
    {
      this.getZone().init();

      await loadFlightScene(this.getZone(), this.getAssets());

      initBackgroundScene();
      initFlightScene();
    }

    /// Tady by asi mělo bejt ještě setnutí stavu GUI, aby se
    /// shownula/hidnula příslušná okna.
  }

  // ---------------- Private methods -------------------

  // private initAssets()
  // {
  //   if (!this.assets)
  //     return;

  //   for (const asset of this.assets)
  //     asset.init();
  // }
}

// ----------------- Auxiliary Functions ---------------------

/// TODO: Tohle by se dalo přesunout do Scenes.
async function loadFlightScene(zone: Zone, assets: Set<Asset>)
{
  try
  {
    // ! Throws exception on error.
    const flightScene = Scenes.getFlightScene();

    flightScene.setZone(zone);
    flightScene.setAssets(assets);

    await flightScene.load();
  }
  catch (error)
  {
    REPORT(error, `Failed to load flight scene`);
  }
}

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