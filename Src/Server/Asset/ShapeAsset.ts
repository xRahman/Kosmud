/*  Part of Kosmud  */

import { Entities } from "../../Server/Class/Entities";
import { ServerAsset } from "../../Server/Asset/ServerAsset";
import { TilemapAsset } from "../../Server/Asset/TilemapAsset";

import * as Shared from "../../Shared/Asset/ShapeAsset";

export class ShapeAsset extends Shared.ShapeAsset implements ServerAsset
{
  protected static version = 0;

  // ---------------- Public methods --------------------

  // public async load()
  // {
  //   // Shapes are not loaded on the server.
  // }

  // ! Throws exception on error.
  public init()
  {
    // ! Throws exception on error.
    const tilemap = this.getTilemapAsset().getTilemap();

    // ! Throws exception on error.
    const shape = tilemap.getShape(this.objectLayerName, this.objectName);

    this.setShape(shape);
  }

  // ! Throws exception on error.
  // ~ Overrides Shared.ShapeAsset.getTilemapAsset().
  public getTilemapAsset()
  {
    // ! Throws exception on error.
    return super.getTilemapAsset().dynamicCast(TilemapAsset);
  }
}

Entities.createRootPrototypeEntity(ShapeAsset);