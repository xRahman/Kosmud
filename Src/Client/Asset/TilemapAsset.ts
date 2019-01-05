/*  Part of Kosmud  */

import { Scene } from "../../Client/Engine/Scene";
import { Entities } from "../../Shared/Class/Entities";
import { ClientAsset } from "../../Client/Asset/ClientAsset";
import { Tilemap } from "../../Client/Engine/Tilemap";
import * as Shared from "../../Shared/Asset/TilemapAsset";

export class TilemapAsset extends Shared.TilemapAsset implements ClientAsset
{
  private tilemap: Tilemap | "Not set" = "Not set";

  // ---------------- Public methods --------------------

  public load(scene: Scene)
  {
    scene.loadTilemap(this);
  }

  // ! Throws exception on error.
  public setTilemap(tilemap: Tilemap)
  {
    if (this.tilemap !== "Not set")
    {
      throw Error(`${this.debugId} already has a tilemap reference`);
    }

    this.tilemap = tilemap;
  }

  // ! Throws exception on error.
  public getTilemap()
  {
    if (this.tilemap === "Not set")
    {
      throw Error(`Tilemap is not inicialized in ${this.debugId}.`
        + ` Make sure init() is called before you access the tilemap`);
    }

    return this.tilemap;
  }
}

Entities.createRootPrototypeEntity(TilemapAsset);