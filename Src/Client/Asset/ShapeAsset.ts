/*  Part of Kosmud  */

import { Physics } from "../../Shared/Physics/Physics";
import { Scene } from "../../Client/Engine/Scene";
import { Entities } from "../../Shared/Class/Entities";
import { ClientAsset } from "../../Client/Asset/ClientAsset";
import { TilemapAsset } from "../../Client/Asset/TilemapAsset";

import * as Shared from "../../Shared/Asset/ShapeAsset";

export class ShapeAsset extends Shared.ShapeAsset implements ClientAsset
{
  private shape: Physics.Shape | "Not set" = "Not set";

  // ---------------- Public methods --------------------

  public load(scene: Scene)
  {
    // Physics shapes are not loaded directly, they are parsed from
    // tilemap data. So we only register ourselves here in the scene so
    // that our shape data is parsed and assigned to us in scene.init()
    scene.addShapeAsset(this);
  }

  public setShape(shape: Physics.Shape)
  {
    if (this.shape !== "Not set")
    {
      throw Error(`${this.debugId} already has reference to physics shape`);
    }

    this.shape = shape;
  }

  public getShape()
  {
    if (this.shape === "Not set")
    {
      throw Error(`${this.debugId} doesn't have reference to physics shape.`
        + ` Make sure respective scene.init() is called before you access`
        + ` the physics shape`);
    }

    return this.shape;
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