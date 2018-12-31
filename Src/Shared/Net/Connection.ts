/*
  Part of Kosmud

  A connection to the server.
*/

import { Player } from "../../Shared/Game/Player";
import { Socket } from "../../Shared/Net/Socket";

export abstract class Connection extends Socket
{
  public player: Player | "Not logged in" = "Not logged in";

  // ---------------- Public methods --------------------

  // ! Throws exception on error.
  public getPlayer(): Player
  {
    if (this.player === "Not logged in")
    {
      throw new Error(`Player ${this.getPlayerInfo()}`
      + ` is not logged in yet`);
    }

    return this.player;
  }

  public setPlayer(player: Player)
  {
    this.player = player;
  }

  public isLoggedIn()
  {
    return this.player !== "Not logged in";
  }

  public abstract getPlayerInfo(): string;
}