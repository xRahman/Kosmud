/*  Part of Kosmud  */

import { Entities } from "../../Server/Class/Entities";
import { TextureDescriptor } from "../../Shared/Asset/TextureDescriptor";
import { Asset } from "../../Server/Asset/Asset";

export class TextureAsset extends Asset
{
  public readonly descriptor = new TextureDescriptor();

  protected static version = 0;

  // ~ Overrides ServerAsset.load().
  public async load()
  {
    // Nothing here (texture isn't loaded on the server).
  }

  // ~ Overrides ServerAsset.init().
  public init()
  {
    // Nothing here (texture doesn't need init on the server).
  }
}

Entities.createRootPrototypeEntity(TextureAsset);