/*
  Part of Kosmud

  GameEntity class ancestor.
*/

import { Asset } from "../../Shared/Asset/Asset";
import { ContainerEntity } from "../../Shared/Class/ContainerEntity";
import { Zone } from "../../Shared/Game/Zone";

export class GameEntity extends ContainerEntity<GameEntity>
{
  private zone: Zone | "Not in zone" = "Not in zone";

  private readonly assets = new Set<Asset>();

  // --------------- Public methods ---------------------

  // ! Throws exception on error.
  public setZone(zone: Zone)
  {
    if (!zone.has(this))
    {
      throw new Error(`Attempt to directly call GameEntity.setZone().`
        + ` That is not possible, use zone.addXY() instead`);
    }

    this.zone = zone;
  }

  // ! Throws exception on error.
  public getZone()
  {
    if (this.zone === "Not in zone")
    {
      throw new Error(`Entity ${this.debugId} is not placed`
        + ` in any zone yet`);
    }

    return this.zone;
  }

  public isInZone()
  {
    return this.zone !== "Not in zone";
  }

  // ! Throws exception on error.
  public addAsset<T extends Asset>(asset: T)
  {
    if (this.assets.has(asset))
    {
      throw new Error(`${this.debugId} already`
        + ` contains asset ${asset.debugId}`);
    }

    this.assets.add(asset);

    return asset;
  }

  // ! Throws exception on error.
  public removeAsset(asset: Asset)
  {
    if (!this.assets.delete(asset))
    {
      throw new Error(`Failed to remove asset ${asset.debugId}`
        + ` from ${this.debugId} because the entity didn't`
        + ` have such asset`);
    }
  }

  public getAssets()
  {
    return this.assets;
  }
}

// ------------------ Type declarations ----------------------

// export namespace GameEntity
// {
// }