/*  Part of Kosmud  */

import { Entities } from "../../Server/Class/Entities";
import { TextureAtlasDescriptor } from
  "../../Shared/Asset/TextureAtlasDescriptor";
import { ServerAsset } from "../../Server/Asset/ServerAsset";

export class TextureAtlasAsset extends ServerAsset
{
  public readonly descriptor = new TextureAtlasDescriptor();

  protected static version = 0;

  // ~ Overrides ServerAsset.load().
  public async load()
  {
    // Nothing here (texture atlas isn't loaded on the server).
  }

  // ~ Overrides ServerAsset.init().
  public init()
  {
    // Nothing here (texture atlas doesn't need init on the server).
  }
}

Entities.createRootPrototypeEntity(TextureAtlasAsset);