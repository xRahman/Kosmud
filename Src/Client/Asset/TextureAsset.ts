/*  Part of Kosmud  */

import { Scene } from "../../Client/Engine/Scene";
import { Entities } from "../../Shared/Class/Entities";
import { ClientAsset } from "../../Client/Asset/ClientAsset";
import * as Shared from "../../Shared/Asset/TextureAsset";

export class TextureAsset extends Shared.TextureAsset implements ClientAsset
{
  public load(scene: Scene)
  {
    scene.loadTexture(this.getId(), this.path);
  }
}

Entities.createRootPrototypeEntity(TextureAsset);