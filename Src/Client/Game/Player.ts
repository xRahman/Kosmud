/*  Part of Kosmud  */

import { Ship } from "../../Client/Game/Ship";
import { Entities } from "../../Shared/Class/Entities";
import * as Shared from "../../Shared/Game/Player";

export class Player extends Shared.Player
{
  // ---------------- Public methods --------------------

  // ! Throws exception on error.
  // ~ Overrides Shared.Player.getActiveShip().
  public getActiveShip()
  {
    return super.getActiveShip().dynamicCast(Ship);
  }
}

Entities.createRootPrototypeEntity(Player);