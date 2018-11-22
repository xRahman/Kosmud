/*
  Part of Kosmud

  Incoming request to enter game.

  (Part of client-server communication protocol.)
*/

import { Connection } from "../../Server/Net/Connection";
import * as Shared from "../../Shared/Protocol/EnterFlightRequest";

/// TEST
import { Zone } from "../../Server/Game/Zone";
import { Ship } from "../../Server/Game/Ship";
import { Game } from "../../Server/Game/Game";
import { EnterFlightResponse } from "../../Shared/Protocol/EnterFlightResponse";

export class EnterFlightRequest extends Shared.EnterFlightRequest
{
  // ---------------- Public methods --------------------

  // ! Throws exception on error.
  // ~ Overrides Packet.process().
  // tslint:disable-next-line:prefer-function-over-method
  public async process(connection: Connection)
  {
    /// TEST
    const fighter = fakeLoadFighter();

    // ! Throws exception on error.
    connection.getAccount().setShip(fighter);

    // ! Throws exception on error.
    sendResponse(connection, fighter);
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

  /// Tímhle se ship dostane do zóny.
  Game.addShip(fighter);

  return fighter;
}

function sendResponse(connection: Connection, ship: Ship)
{
  const shipState = ship.getInitialState();

  /// TODO: Tady by se správně měla posílat zóna
  /// (respektive to z ní, co player vidí).
  const packet = new EnterFlightResponse
  (
    shipState.shape,
    shipState.position,
    shipState.rotation
  );

  connection.send(packet);
}