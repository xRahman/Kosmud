/*  Part of Kosmud  */

import { Attributes } from "../../Shared/Class/Attributes";
import { TilemapAsset } from "../../Shared/Asset/TilemapAsset";
import { Physics } from "../../Shared/Physics/Physics";
import { Asset } from "../../Shared/Asset/Asset";

export abstract class ShapeAsset extends Asset
{
  public objectLayerName = "<missing object layer name>";
  public objectName = "<missing object name>";

  private tilemapAsset: TilemapAsset | "Not set" = "Not set";

  private shape: Physics.Shape | "Not set" = "Not set";
  private static readonly shape: Attributes =
  {
    saved: false,
    sentToClient: false
  };

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

    // ! Throws exception on error.
  public setShape(shape: Physics.Shape)
  {
    if (this.shape === "Not set")
    {
      throw Error(`${this.debugId} already has physics shape reference`);
    }

    this.shape = shape;
  }

  // ! Throws exception on error.
  public getShape()
  {
    if (this.shape === "Not set")
    {
      throw Error(`${this.debugId} doesn't have physics shape`);
    }

    return this.shape;
  }
}