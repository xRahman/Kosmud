/*
  Part of Kosmud

  Incoming request to enter game.

  (Part of client-server communication protocol.)
*/

import { Connection } from "../../Server/Net/Connection";
import * as Shared from "../../Shared/Protocol/EnterGame";

/// TEST
import { Zone } from "../../Server/Game/Zone";
import { Ship } from "../../Server/Game/Ship";
import { Game } from "../../Server/Game/Game";
import { ShipToScene } from "../../Shared/Protocol/ShipToScene";

export class EnterGame extends Shared.EnterGame
{
  // ---------------- Public methods --------------------

  // ! Throws exception on error.
  // ~ Overrides Packet.process().
  // tslint:disable-next-line:prefer-function-over-method
  public async process(connection: Connection)
  {
    /// TEST
    const fighter = fakeLoadFighter();

    connection.getAccount().setShip(fighter);
    // ! Throws exception on error.

    // Poslat ShipToScene().
    sendShipToScene(connection, fighter);
  }
}

// This class is registered in Server/Net/Connection.

// ----------------- Auxiliary Functions ---------------------

/// TEST
function fakeLoadFighter()
{
  const fighter = new Ship();

  /// TODO: Nasetovat properties, které se časem budou setovat
  /// editorem a loadovat.
  fighter.setShapeId(Zone.FIGHTER_SHAPE_ID);
  Game.addShip(fighter);

  return fighter;
}

function sendShipToScene(connection: Connection, ship: Ship)
{
  const shipState = ship.getInitialState();

  const packet = new ShipToScene
  (
    shipState.shape,
    shipState.position,
    shipState.rotation
  );

  connection.send(packet);
}