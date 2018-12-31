/*
  Part of Kosmud

  Player accounts.
*/

import { Entities } from "../../Server/Class/Entities";
import { Player } from "../../Server/Game/Player";

export namespace Players
{
  export function newPlayer()
  {
    return Entities.newRootEntity(Player);
  }

  export async function loadPlayer()
  {
    // TODO: Determine account id.
    /// (Zatím natvrdo.)
    const playerId = "1-jq6wqw3s";

    // ! Throws exception on error.
    const entity = await Entities.loadEntity(Player.dataDirectory, playerId);

    // ! Throws exception on error.
    return entity.dynamicCast(Player);
  }
}