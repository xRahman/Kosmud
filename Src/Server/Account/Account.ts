/*
  Part of Kosmud

  Player account.
*/

import { Ship } from "../../Server/Game/Ship";

export class Account
{
  private ship: Ship | "Not in game" = "Not in game";

  // ---------------- Public methods --------------------

  // ! Throws exception on error.
  public setShip(ship: Ship)
  {
    if (this.ship !== "Not in game")
    {
      throw new Error(`Player is already in game`);
    }

    this.ship = ship;
  }

  // ! Throws exception on error.
  public getShip(): Ship
  {
    if (this.ship === "Not in game")
    {
      throw new Error(`Player is not in game yet`);
    }

    return this.ship;
  }
}
