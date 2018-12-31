/*
  Part of Kosmud

  Incoming request to enter game.

  (Part of client-server communication protocol.)
*/

import { ClassFactory } from "../../Shared/Class/ClassFactory";
import { Connection } from "../../Server/Net/Connection";
import * as Shared from "../../Shared/Protocol/EnterFlightRequest";

/// TEST
import { Ship } from "../../Server/Game/Ship";
import { EnterFlightResponse } from
  "../../Shared/Protocol/EnterFlightResponse";

export class EnterFlightRequest extends Shared.EnterFlightRequest
{
  // ---------------- Public methods --------------------

  // ! Throws exception on error.
  // ~ Overrides Packet.process().
  public async process(connection: Connection)
  {
    // const account = connection.getAccount();

    // if (account.hasShip())
    // {
    //   sendResponse(connection, account.getShip());
    // }
    // else
    // {
    //   /// TEST
    //   const fighter = fakeLoadFighter();

    //   // ! Throws exception on error.
    //   account.setShip(fighter);

    //   // ! Throws exception on error.
    //   sendResponse(connection, fighter);
    // }
  }
}

// This class is registered in Server/Net/Connection.

// ----------------- Auxiliary Functions ---------------------

// /// TEST
// function fakeLoadFighter()
// {
//   const fighter = new Ship();

//   /// TEST
//   fighter.setId("TEST_FIGHTER_ID");
//   fighter.physics.shapeId = Zone.FIGHTER_SHAPE_ID;

//   /// Tímhle se ship dostane do zóny.
//   // Game.addShip(fighter);

//   return fighter;
// }

function sendResponse(connection: Connection, ship: Ship)
{
  // const shipState = ship.getInitialState();

  /// TODO: Tady by se správně měla posílat zóna
  /// (respektive to z ní, co player vidí).
  const packet = ClassFactory.newInstance(EnterFlightResponse);
  /// Původní parametry:
  // shipState.shape,
  // shipState.position,
  // shipState.rotation

  connection.send(packet);
}