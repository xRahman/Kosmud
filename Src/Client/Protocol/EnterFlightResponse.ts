/*
  Part of Kosmud

  Notifies the client about a new visible ship.

  (Part of client-server communication protocol.)
*/

import { Zone } from "../../Client/Game/Zone";
import { Renderer } from "../../Client/Engine/Renderer";
import { Connection } from "../../Client/Net/Connection";
import * as Shared from "../../Shared/Protocol/EnterFlightResponse";
import { REPORT } from "../../Shared/Log/REPORT";

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
  Renderer.flightScene.setZone(zone);

  try
  {
    await Renderer.flightScene.load();
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
    Renderer.flightScene.init();
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

  /// TEST:
  /// (lodě - obecně obsah zóny - by měly bejt poslaný rovnou se zónou)
  /// Změna: Loď se bude do zóny přidávat až v creatu(). Před preloadem
  /// to jednak není potřeba a navíc se pak loď snaží vložit do physics
  /// worldu, který ještě není vytvořený (dá se vyrobit až v creatu, když
  /// jsou naloadované physics shapy).
  // zone.addShip(this.createShip());

  return zone;
}

// This class is registered in Client/Net/Connection.