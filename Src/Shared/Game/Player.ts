/*  Part of Kosmud  */

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
      throw Error(`Player ${this.debugId} doesn't have an active ship`);
    }

    return this.activeShip;
  }

  public isInZone()
  {
    if (this.activeShip === "Not set")
      return false;

    return this.activeShip.isInZone();
  }

  // ! Throws exception on error.
  public getZone()
  {
    // ! Throws exception on error.
    return this.getActiveShip().getZone();
  }
}