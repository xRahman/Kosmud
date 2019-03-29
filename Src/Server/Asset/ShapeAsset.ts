/*  Part of Kosmud  */

import { Attributes } from "../../Shared/Class/Attributes";
import { Physics } from "../../Shared/Physics/Physics";
import { Entities } from "../../Server/Class/Entities";
import { ShapeDescriptor } from "../../Shared/Asset/ShapeDescriptor";
import { TilemapAsset } from "../../Server/Asset/TilemapAsset";
import { ServerAsset } from "../../Server/Asset/ServerAsset";

export class ShapeAsset extends ServerAsset
{
  public readonly descriptor = new ShapeDescriptor();

  protected static version = 0;

  private tilemapAsset: TilemapAsset | "Not set" = "Not set";

  private shape: Physics.Shape | "Not set" = "Not set";
  private static readonly shape: Attributes =
  {
    saved: false,
    sentToClient: false
  };

  // ---------------- Public methods --------------------

  // ~ Overrides ServerAsset.load().
  public async load()
  {
    // Nothing here (shapes are not loaded on the server).
  }

  // ! Throws exception on error.
  // ~ Overrides ServerAsset.init().
  public init()
  {
    // ! Throws exception on error.
    const tilemap = this.getTilemapAsset().getTilemap();

    // ! Throws exception on error.
    const shape = tilemap.getShape
    (
      this.descriptor.objectLayerName,
      this.descriptor.objectName
    );

    this.setShape(shape);
  }

  // ! Throws exception on error.
  public getTilemapAsset()
  {
    if (this.tilemapAsset === "Not set")
    {
      throw Error(`Shape asset ${this.debugId} doesn't have 'tilemapAsset'`
        + ` reference`);
    }

    return this.tilemapAsset;
  }

  // ! Throws exception on error.
  public setTilemapAsset(tilemapAsset: TilemapAsset)
  {
    if (this.hasOwnProperty("tilemapAsset") && this.tilemapAsset !== "Not set")
    {
      throw Error(`Shape asset ${this.debugId} already has a tilemap asset`);
    }

    this.tilemapAsset = tilemapAsset;
  }

  // ! Throws exception on error.
  public setShape(shape: Physics.Shape)
  {
    if (this.hasOwnProperty("shape") && this.shape !== "Not set")
    {
      throw Error(`Shape asset ${this.debugId} already has physics`
        + ` shape reference`);
    }

    this.shape = shape;
  }

  // ! Throws exception on error.
  public getShape()
  {
    if (this.shape === "Not set")
    {
      throw Error(`Shape asset ${this.debugId} doesn't have`
        + ` physics shape initialized`);
    }

    return this.shape;
  }
}

Entities.createRootPrototypeEntity(ShapeAsset);