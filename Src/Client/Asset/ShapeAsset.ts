/*  Part of Kosmud  */

import { Attributes } from "../../Shared/Class/Attributes";
import { Physics } from "../../Shared/Physics/Physics";
import { Scene } from "../../Client/Engine/Scene";
import { Entities } from "../../Shared/Class/Entities";
import { ShapeDescriptor } from "../../Shared/Asset/ShapeDescriptor";
import { ClientAsset } from "../../Client/Asset/ClientAsset";
import { TilemapAsset } from "../../Client/Asset/TilemapAsset";

export class ShapeAsset extends ClientAsset
{
  protected static version = 0;

  protected descriptor = new ShapeDescriptor();

  private tilemapAsset: TilemapAsset | "Not set" = "Not set";

  private shape: Physics.Shape | "Not set" = "Not set";
  private static readonly shape: Attributes =
  {
    saved: false,
    sentToClient: false
  };

  // ---------------- Public methods --------------------

  // ~ Overrides ClientAsset.load().
  public load(scene: Scene)
  {
    // Physics shapes are not loaded directly, they are parsed from
    // tilemap data. So we only register ourselves in the scene so
    // our shape data is parsed and assigned to us in scene.init()
    scene.addShapeAsset(this);
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