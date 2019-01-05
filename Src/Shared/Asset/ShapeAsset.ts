/*  Part of Kosmud  */

import { TilemapAsset } from "../../Shared/Asset/TilemapAsset";
import { Entities } from "../../Shared/Class/Entities";
import { Asset } from "../../Shared/Asset/Asset";

export class ShapeAsset extends Asset
{
  public objectLayerName = "<missing object layer name>";
  public objectName = "<missing object name>";

  private tilemapAsset: TilemapAsset | "Not set" = "Not set";

  // ---------------- Public methods --------------------

  // ! Throws exception on error.
  public setTilemapAsset(tilemapAsset: TilemapAsset)
  {
    if (this.tilemapAsset === "Not set")
    {
      throw Error(`${this.debugId} already has tilemap asset reference`);
    }

    this.tilemapAsset = tilemapAsset;
  }

  // ! Throws exception on error.
  public getTilemapAsset()
  {
    if (this.tilemapAsset === "Not set")
    {
      throw Error(`${this.debugId} doesn't have tilemap asset reference`);
    }

    return this.tilemapAsset;
  }
}

Entities.createRootPrototypeEntity(ShapeAsset);