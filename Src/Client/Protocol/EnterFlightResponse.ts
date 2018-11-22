/*
  Part of Kosmud

  Notifies the client about a new visible ship.

  (Part of client-server communication protocol.)
*/

import { Ship } from "../../Client/Game/Ship";
import { Zone } from "../../Client/Game/Zone";
import { Renderer } from "../../Client/Engine/Renderer";
import { Connection } from "../../Client/Net/Connection";
import * as Shared from "../../Shared/Protocol/EnterFlightResponse";

export class EnterFlightResponse extends Shared.EnterFlightResponse
{
  // ---------------- Public methods --------------------

  // ~ Overrides Packet.process().
  public async process(connection: Connection)
  {
    /// TODO: V rámci tohohle packetu by měla být data zóny
    ///   (co se má preloadnout, co player vidí).
    /// Tzn. tady je potřeba creatnout zónu (nebo ji prostě
    /// deserializovat z packetu).

    const zone = createZone();

    /// TODO: Následně se tady vyrobí flight scéna z dat zóny.

    /// TODO: Tohle by se mělo udělat o řádek vejš automaticky
    /// při vytváření zóny.
    /// (Zatím ale budu loď přidávat rovnou do zóny)
    // Renderer.getFlightScene().addShip(this);

    /// TEST:
    zone.addShip(this.createShip());

    const flightScene = Renderer.createFlightScene(zone);
  }

  // ---------------- Private methods -------------------

  // ! Throws exception on error.
  private createShip()
  {
    return new Ship
    (
      /// Problém: Ship potřebuje scénu (aby si mohla vytvořit grafiku).
      ///   Já ji ale chci vytvořit a přidat do zóny ještě předtím, než
      ///   vytvořím scénu.
      scene,
      this.shipShape,
      this.shipPosition,
      this.shipRotation
    );
  }
}

// ----------------- Auxiliary Functions ---------------------

function createZone()
{
  return new Zone();
}

// This class is registered in Client/Net/Connection.