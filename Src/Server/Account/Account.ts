/*
  Part of Kosmud

  Player account.
*/

import { FileSystem } from "../../Server/FileSystem/FileSystem";
import { Ship } from "../../Server/Game/Ship";
import { Zone } from "../../Server/Game/Zone";
import { Entities } from "../../Server/Class/Entities";
import { Entity } from "../../Shared/Class/Entity";
import { ZoneUpdate } from "../../Shared/Protocol/ZoneUpdate";

export class Account extends Entity
{
  public static dataDirectory = "./Data/Accounts/";

  protected static version = 0;

  private ship: Ship | "Not assigned" = "Not assigned";

  // ---------------- Public methods --------------------

  // ! Throws exception on error.
  public setShip(ship: Ship)
  {
    if (this.ship !== "Not assigned")
    {
      throw new Error(`Account ${this.debugId} already has assigned`
        + ` ship ${this.ship.debugId}`);
    }

    this.ship = ship;
  }

  public hasShip()
  {
    return this.ship !== "Not assigned";
  }

  // ! Throws exception on error.
  public getShip(): Ship
  {
    if (this.ship === "Not assigned")
    {
      throw new Error(`Account ${this.debugId} doesn't`
        + ` have a ship assigned`);
    }

    return this.ship;
  }

  // ! Throws exception on error.
  public async save()
  {
    // ! Throws exception on error.
    const fileName = Entities.getFileName(this.getId());
    // ! Throws exception on error.
    const data = this.serialize("Save to file");

    // ! Throws exception on error.
    await FileSystem.writeFile(Account.dataDirectory, fileName, data);
  }

  public getClientUpdate(): ZoneUpdate | "No update"
  {
    if (!this.hasShip())
      return "No update";

    // ! Throws exception on error.
    const ship = this.getShip();

    if (!ship.isInZone())
      return "No update";

    // ! Throws exception on error.
    // Use dynamic cast because we need server version of Zone.
    const zone = ship.getZone().dynamicCast(Zone);
    return zone.getUpdate();
  }
}

Entities.createRootPrototypeEntity(Account);