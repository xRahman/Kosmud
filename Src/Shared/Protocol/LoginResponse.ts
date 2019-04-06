/*  Part of Kosmud  */

import { Asset } from "../../Shared/Asset/Asset";
import { Player } from "../../Shared/Game/Player";
import { Zone } from "../../Shared/Game/Zone";
import { Packet } from "../../Shared/Protocol/Packet";

export class LoginResponse<P extends Player, Z extends Zone, A extends Asset>
  extends Packet
{
  /// Pozn.: "neinicializovaná" hodnota musí být 'undefined' a ne nějakej
  ///   string (třeba "Not set"), protože při deserializaci se kontroluje,
  ///   jestli se zapisuje do proměnné správného typu (nebo undefined).
  private assets: Set<A> | undefined = undefined;

  private player: P | undefined = undefined;
  private zone: Z | undefined = undefined;

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
  public setAssets(assets: Set<A>)
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
    if (!this.player)
      throw Error("Missing 'player' in login response");

    return this.player;
  }

  // ! Throws exception on error.
  protected getZone()
  {
    if (!this.zone)
    {
      throw Error("Missing 'zone' in login response");
    }

    return this.zone;
  }

  protected hasZone()
  {
    return this.zone !== undefined;
  }

  // ! Throws exception on error.
  protected getAssets()
  {
    if (!this.assets)
    {
      throw Error("Missing 'assets' in login response");
    }

    return this.assets;
  }
}