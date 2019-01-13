/*  Part of Kosmud  */

import { Entities } from "../../Server/Class/Entities";
import { ServerAsset } from "../../Server/Asset/ServerAsset";
import * as Shared from "../../Shared/Asset/TextureAsset";

export class TextureAsset extends Shared.TextureAsset implements ServerAsset
{
  protected static version = 0;

  // public async load()
  // {
  //   // Textures are not loaded on the server.
  // }
}

Entities.createRootPrototypeEntity(TextureAsset);