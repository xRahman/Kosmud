/*  Part of Kosmud  */

import { Attributes } from "../../Shared/Class/Attributes";
import { Tilemap } from "../../Shared/Engine/Tilemap";
import { Asset } from "../../Shared/Asset/Asset";

export abstract class TilemapAsset extends Asset
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
      throw Error(`Tilemap asset ${this.debugId} doesn't`
        + ` have a tilemap data loaded yet`);
    }

    return this.tilemap;
  }
}