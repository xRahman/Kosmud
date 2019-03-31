/*  Part of Kosmud  */

import { Scene } from "../../Client/Engine/Scene";
import { Entities } from "../../Shared/Class/Entities";
import { TextureDescriptor } from "../../Shared/Asset/TextureDescriptor";
import { Asset } from "../../Client/Asset/Asset";
import * as Shared from "../../Shared/Asset/TextureAsset";

export class TextureAsset extends Asset implements Shared.TextureAsset
{
  public readonly descriptor = new TextureDescriptor();

  protected static version = 0;

  // ---------------- Public methods --------------------

  // ~ Overrides ClientAsset.load().
  public load(scene: Scene)
  {
    scene.loadTexture(this.getId(), this.descriptor.path);
  }
}

Entities.createRootPrototypeEntity(TextureAsset);