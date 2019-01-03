/*  Part of Kosmud  */

import { FileSystem } from "../../Server/FileSystem/FileSystem";
import { Zone } from "../../Server/Game/Zone";
import { Entities } from "../../Server/Class/Entities";
import { ZoneUpdate } from "../../Shared/Protocol/ZoneUpdate";
import * as Shared from "../../Shared/Game/Player";

export class Player extends Shared.Player
{
  public static dataDirectory = "./Data/Players/";

  protected static version = 0;

  // ---------------- Public methods --------------------

  // ! Throws exception on error.
  public async save()
  {
    // ! Throws exception on error.
    const fileName = Entities.getFileName(this.getId());
    // ! Throws exception on error.
    const data = this.serialize("Save to file");

    // ! Throws exception on error.
    await FileSystem.writeFile(Player.dataDirectory, fileName, data);
  }

  public getClientUpdate(): ZoneUpdate | "No update"
  {
    if (!this.hasActiveShip())
      return "No update";

    // ! Throws exception on error.
    const ship = this.getActiveShip();

    if (!ship.isInZone())
      return "No update";

    // ! Throws exception on error.
    // Use dynamic cast because we need server version of Zone.
    const zone = ship.getZone().dynamicCast(Zone);
    return zone.getUpdate();
  }
}

Entities.createRootPrototypeEntity(Player);