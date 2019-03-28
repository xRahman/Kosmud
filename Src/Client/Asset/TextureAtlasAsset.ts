/*  Part of Kosmud  */

import { Scene } from "../../Client/Engine/Scene";
import { Entities } from "../../Shared/Class/Entities";
import { TextureAtlasDescriptor } from
  "../../Shared/Asset/TextureAtlasDescriptor";
import { ClientAsset } from "../../Client/Asset/ClientAsset";

export class TextureAtlasAsset extends ClientAsset
{
  protected static version = 0;

  protected descriptor = new TextureAtlasDescriptor();

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