/*  Part of Kosmud  */

import { Asset } from "../../Shared/Asset/Asset";
import { Player } from "../../Shared/Game/Player";
import { Zone } from "../../Shared/Game/Zone";
import { Packet } from "../../Shared/Protocol/Packet";

export class LoginResponse<P extends Player, Z extends Zone> extends Packet
{
  private player: P | "Not set" = "Not set";
  private zone: Z | "Not set" = "Not set";
  private assets: Set<Asset> | "Not set" = "Not set";

  // ! Throws exception on error.
  public setPlayer(player: P)
  {
    // ! Throws exception on error.
    this.player = this.addEntity(player);
  }

  // ! Throws exception on error.
  public setZone(zone: Z)
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

  // --------------- Protected methods ------------------

  // ! Throws exception on error.
  protected getPlayer()
  {
    if (this.player === "Not set")
    {
      throw Error(`Missing 'player' in login response`);
    }

    return this.player;
  }

  // ! Throws exception on error.
  protected getZone()
  {
    if (this.zone === "Not set")
    {
      throw Error(`Missing 'zone' in login response`);
    }

    return this.zone;
  }

  // ! Throws exception on error.
  protected getAssets()
  {
    if (this.assets === "Not set")
    {
      throw Error(`Missing 'assets' in login response`);
    }

    return this.assets;
  }
}