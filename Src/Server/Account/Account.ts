/*
  Part of Kosmud

  Player account.
*/

import { Entity } from "../../Shared/Class/Entity";
import { Ship } from "../../Server/Game/Ship";

export class Account extends Entity
{
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
}
