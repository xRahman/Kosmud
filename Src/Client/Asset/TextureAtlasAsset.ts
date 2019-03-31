/*  Part of Kosmud  */

import { Scene } from "../../Client/Engine/Scene";
import { Entities } from "../../Shared/Class/Entities";
import { TextureAtlasDescriptor } from
  "../../Shared/Asset/TextureAtlasDescriptor";
import { Asset } from "../../Client/Asset/Asset";
import * as Shared from "../../Shared/Asset/TextureAtlasAsset";

export class TextureAtlasAsset
  extends Asset
  implements Shared.TextureAtlasAsset
{
  public readonly descriptor = new TextureAtlasDescriptor();

  protected static version = 0;

  // ---------------- Public methods --------------------

  // ~ Overrides ClientAsset.load().
  public load(scene: Scene)
  {
    scene.loadTextureAtlas
    (
      this.getId(),
      this.descriptor.path,
      this.descriptor.textureDirectory
    );
  }
}

Entities.createRootPrototypeEntity(TextureAtlasAsset);