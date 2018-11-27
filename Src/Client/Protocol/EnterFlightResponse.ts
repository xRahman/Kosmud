/*
  Part of Kosmud

  Notifies the client about a new visible ship.

  (Part of client-server communication protocol.)
*/

import { REPORT } from "../../Shared/Log/REPORT";
import { Zone } from "../../Client/Game/Zone";
import { Renderer } from "../../Client/Engine/Renderer";
import { Connection } from "../../Client/Net/Connection";
import { Scenes } from "../../Client/Engine/Scenes";
import * as Shared from "../../Shared/Protocol/EnterFlightResponse";

export class EnterFlightResponse extends Shared.EnterFlightResponse
{
  // ---------------- Public methods --------------------

  // ~ Overrides Packet.process().
  // tslint:disable-next-line:prefer-function-over-method
  public async process(connection: Connection)
  {
    const zone = fakeCreateZone();

    await loadFlightScene(zone);

    initFlightScene();

    /// Tady by asi mělo bejt ještě setnutí stavu GUI, aby se
    /// shownula/hidnula příslušná okna.
  }

  // ---------------- Private methods -------------------
}

// ----------------- Auxiliary Functions ---------------------

async function loadFlightScene(zone: Zone)
{
  Scenes.flightScene.setZone(zone);

  try
  {
    await Scenes.flightScene.load();
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
    Scenes.flightScene.init();
  }
  catch (error)
  {
    REPORT(error, `Failed to init flight scene`);
  }
}

/// TEST
function fakeCreateZone()
{
  const zone = new Zone();

  zone.createPhysicsWorld();

  return zone;
}

// This class is registered in Client/Net/Connection.