/*
  Part of Kosmud

  GameEntity class ancestor.
*/

import { ContainerEntity } from "../../Shared/Class/ContainerEntity";
import { Zone } from "../../Shared/Game/Zone";

export class GameEntity extends ContainerEntity
{
  private zone: Zone | "Not in zone" = "Not in zone";

  // --------------- Public methods ---------------------

  // ! Throws exception on error.
  public setZone(zone: Zone)
  {
    if (!zone.has(this))
    {
      throw new Error(`Attempt to directly call GameEntity.setZone().`
        + ` That is not possible, use zone.addXY() instead`);
    }

    this.zone = zone;
  }

  // ! Throws exception on error.
  public getZone()
  {
    if (this.zone === "Not in zone")
    {
      throw new Error(`Entity ${this.debugId} is not placed`
        + ` in any zone yet`);
    }

    return this.zone;
  }
}

// ------------------ Type declarations ----------------------

// export namespace GameEntity
// {
// }