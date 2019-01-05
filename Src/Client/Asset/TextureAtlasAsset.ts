/*  Part of Kosmud  */

import { Scene } from "../../Client/Engine/Scene";
import { Entities } from "../../Shared/Class/Entities";
import { ClientAsset } from "../../Client/Asset/ClientAsset";
import * as Shared from "../../Shared/Asset/TextureAtlasAsset";

export class TextureAtlasAsset extends Shared.TextureAtlasAsset
  implements ClientAsset
{
  public load(scene: Scene)
  {
    scene.loadTextureAtlas(this.getId(), this.path, this.textureDirectory);
  }
}

Entities.createRootPrototypeEntity(TextureAtlasAsset);