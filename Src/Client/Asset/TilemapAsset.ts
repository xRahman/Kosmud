/*  Part of Kosmud  */

import { Attributes } from "../../Shared/Class/Attributes";
// import { Types } from "../../Shared/Utils/Types";
import { Scene } from "../../Client/Engine/Scene";
import { Entities } from "../../Shared/Class/Entities";
import { TilemapDescriptor } from "../../Shared/Asset/TilemapDescriptor";
import { Asset } from "../../Client/Asset/Asset";
import { Tilemap } from "../../Client/Engine/Tilemap";

export class TilemapAsset extends Asset
{
  public readonly descriptor = new TilemapDescriptor();

  protected static version = 0;

  private tilemap: Tilemap | "Not set" = "Not set";
  private static readonly tilemap: Attributes =
  {
    saved: false,
    sentToClient: false
  };

  // ---------------- Public methods --------------------

  // ~ Overrides ClientAsset.load().
  public load(scene: Scene)
  {
    scene.loadTilemap(this);
  }

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

Entities.createRootPrototypeEntity(TilemapAsset);