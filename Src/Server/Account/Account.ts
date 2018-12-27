/*
  Part of Kosmud

  Player account.
*/

import { FileSystem } from "../../Server/FileSystem/FileSystem";
import { Ship } from "../../Server/Game/Ship";
import * as Entities from "../../Shared/Class/Entities";
import { Entity } from "../../Shared/Class/Entity";

const accountsDirectory = "./Data/Accounts/";

export class Account extends Entity
{
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

  public save()
  {
    const fileName = this.getId();
    const data = this.serialize("Save to File");

    FileSystem.writeFile(accountsDirectory, fileName, data);
  }
}

Entities.createRootPrototypeEntity(Account);