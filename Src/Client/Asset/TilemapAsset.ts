/*  Part of Kosmud  */

import { Types } from "../../Shared/Utils/Types";
import { Scene } from "../../Client/Engine/Scene";
import { Entities } from "../../Shared/Class/Entities";
import { ClientAsset } from "../../Client/Asset/ClientAsset";
import { Tilemap } from "../../Client/Engine/Tilemap";
import * as Shared from "../../Shared/Asset/TilemapAsset";

export class TilemapAsset extends Shared.TilemapAsset implements ClientAsset
{
  // private tilemap: Tilemap | "Not set" = "Not set";

  // ---------------- Public methods --------------------

  public load(scene: Scene)
  {
    scene.loadTilemap(this);
  }

  // ! Throws exception on error.
  public getTilemap()
  {
    return Types.dynamicCast(super.getTilemap(), Tilemap);
  }
}

Entities.createRootPrototypeEntity(TilemapAsset);