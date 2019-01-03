/*  Part of Kosmud  */

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
  const response = createOkResponse(player);

  connection.send(response);
}

// ! Throws exception on error.
function createOkResponse(player: Player)
{
  // ! Throws exception on error.
  const response = ClassFactory.newInstance(LoginResponse);

  // ! Throws exception on error.
  response.setPlayer(player);

  if (player.isInZone())
  {
    // ! Throws exception on error.
    const zone = player.getZone();
    const assets = zone.compileListOfAssets();

    response.setZone(zone);
    response.setAssets(assets);
  }

  return response;
}

// This class is registered in Server/Net/Connection.