/*
  Part of Kosmud

  Request to enter the game.

  (Part of client-server communication protocol.)
*/

import { Asset } from "../../Shared/Asset/Asset";
import { Player } from "../../Shared/Game/Player";
import { Zone } from "../../Shared/Game/Zone";
import { Packet } from "../../Shared/Protocol/Packet";

export class LoginResponse extends Packet
{
  private player: Player | "Not set" = "Not set";
  private zone: Zone | "Not set" = "Not set";
  private assets: Set<Asset> | "Not set" = "Not set";

  // ! Throws exception on error.
  public setPlayer(player: Player)
  {
    // ! Throws exception on error.
    this.player = this.addEntity(player);
  }

  // ! Throws exception on error.
  public setZone(zone: Zone)
  {
    // ! Throws exception on error.
    this.zone = this.addEntity(zone);
  }

  // ! Throws exception on error.
  public setAssets(assets: Set<Asset>)
  {
    for (const asset of assets)
      this.addEntity(asset);

    // ! Throws exception on error.
    this.assets = assets;
  }
}