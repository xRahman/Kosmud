/*
  Part of Kosmud

  Server-side functionality regarding ships.
*/

import { Ship } from "../../Server/Game/Ship";
import { Entities } from "../../Server/Class/Entities";
import * as Shared from "../../Shared/Game/Ships";

export class Ships extends Shared.Ships
{
  // ------------- Public static methods ----------------

  public static newShip(name: string)
  {
    const ship = Entities.newRootEntity(Ship);

    ship.setName(name);

    return ship;
  }
}