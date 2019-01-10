/*  Part of Kosmud  */

import { Attributes } from "../../Shared/Class/Attributes";
import { Tilemap } from "../../Shared/Engine/Tilemap";
import { Entities } from "../../Shared/Class/Entities";
import { Asset } from "../../Shared/Asset/Asset";

export class TilemapAsset extends Asset
{
  public path = "<missing file path>";

  private tilemap: Tilemap | "Not set" = "Not set";
  private static readonly tilemap: Attributes =
  {
    saved: false,
    sentToClient: false
  };

  // ---------------- Public methods --------------------

  public setTilemap(tilemap: Tilemap)
  {
    if (this.tilemap !== "Not set")
    {
      throw Error(`Tilemap is already set to ${this.debugId}`);
    }

    this.tilemap = tilemap;
  }

  public getTilemap()
  {
    if (this.tilemap === "Not set")
    {
      throw Error(`${this.debugId} doesn't have a tilemap set yet`);
    }

    return this.tilemap;
  }
}

Entities.createRootPrototypeEntity(TilemapAsset);