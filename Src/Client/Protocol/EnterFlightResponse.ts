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

    const zone = this.createZone();

    connection.setZone(zone);

    /// TODO: Následně se tady vyrobí flight scéna z dat zóny.

    /// TODO: Tohle by se mělo udělat o řádek vejš automaticky
    /// při vytváření zóny.
    /// (Zatím ale budu loď přidávat rovnou do zóny)
    // Renderer.getFlightScene().addShip(this);

    // This will cause Phaser engine to call preload() and creat()
    // on the flight scene and then periodically call update() and
    // draw the scene.
    Renderer.startFlightScene(zone);
  }

  // ---------------- Private methods -------------------

  // ! Throws exception on error.
  private createShip()
  {
    const flightScene = Renderer.flightScene;
    const ship = new Ship(flightScene);

    ship.setPosition(this.shipPosition);
    ship.setRotation(this.shipRotation);

    /// TEST
    ship.setShapeId(Zone.FIGHTER_SHAPE_ID);

    return ship;
  }

  /// TEST
  private createZone()
  {
    const zone = new Zone();

    zone.createPhysicsWorld();

    /// TEST:
    /// (lodě - obecně obsah zóny - by měly bejt poslaný rovnou se zónou)
    zone.addShip(this.createShip());

    return zone;
  }
}

// ----------------- Auxiliary Functions ---------------------

// This class is registered in Client/Net/Connection.