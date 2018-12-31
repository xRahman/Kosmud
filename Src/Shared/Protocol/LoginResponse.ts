/*
  Part of Kosmud

  Request to enter the game.

  (Part of client-server communication protocol.)
*/

import { Player } from "../../Shared/Game/Player";
import { Packet } from "../../Shared/Protocol/Packet";

export class LoginResponse extends Packet
{
  private player: Player;

  public setPlayer(player: Player)
  {
    this.player = this.add(player);
  }
}