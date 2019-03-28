/*  Part of Kosmud  */

import { Entities } from "../../Server/Class/Entities";
import { TextureDescriptor } from "../../Shared/Asset/TextureDescriptor";
import { ServerAsset } from "../../Server/Asset/ServerAsset";

export class TextureAsset extends ServerAsset
{
  protected static version = 0;

  protected descriptor = new TextureDescriptor();

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