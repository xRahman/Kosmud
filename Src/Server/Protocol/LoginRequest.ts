/*
  Part of Kosmud

  Incoming request to enter game.

  (Part of client-server communication protocol.)
*/

import { Player } from "../../Server/Game/Player";
import { Players } from "../../Server/Game/Players";
// import * as Entities from "../../Server/Class/Entities";
import { Connection } from "../../Server/Net/Connection";
import { ClassFactory } from "../../Shared/Class/ClassFactory";
import { LoginResponse } from "../../Shared/Protocol/LoginResponse";
import * as Shared from "../../Shared/Protocol/LoginRequest";

export class LoginRequest extends Shared.LoginRequest
{
  // ---------------- Public methods --------------------

  // ! Throws exception on error.
  // ~ Overrides Packet.process().
  public async process(connection: Connection)
  {
    // /// TEST: Vyrobit a savnout playera.
    // const player = Players.newPlayer();
    // await player.save();

    const player = await Players.loadPlayer();

    connection.setPlayer(player);

    acceptRequest(connection, player);
  }
}

// ----------------- Auxiliary Functions ---------------------

function acceptRequest(connection: Connection, player: Player)
{
  const response = ClassFactory.newInstance(LoginResponse);

  response.setPlayer(player);

  connection.send(response);
}

// This class is registered in Server/Net/Connection.