/*
  Part of Kosmud

  Player account.
*/

import { Ship } from "../../Shared/Game/Ship";
import { Entity } from "../../Shared/Class/Entity";

export class Player extends Entity
{
  private activeShip: Ship | "Not set" = "Not set";

  // ---------------- Public methods --------------------

  // ! Throws exception on error.
  public setActiveShip(ship: Ship)
  {
    this.activeShip = ship;
  }

  public hasActiveShip()
  {
    return this.activeShip !== "Not set";
  }

  // ! Throws exception on error.
  public getActiveShip(): Ship
  {
    if (this.activeShip === "Not set")
    {
      throw new Error(`Player ${this.debugId}`
        + ` doesn't have an active ship`);
    }

    return this.activeShip;
  }
}