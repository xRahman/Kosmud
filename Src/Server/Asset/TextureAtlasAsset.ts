/*  Part of Kosmud  */

import { Entities } from "../../Server/Class/Entities";
import { ServerAsset } from "../../Server/Asset/ServerAsset";
import * as Shared from "../../Shared/Asset/TextureAtlasAsset";

export class TextureAtlasAsset extends Shared.TextureAtlasAsset
  implements ServerAsset
{
  // public async load()
  // {
  //   // Textures atlases are not loaded on the server.
  // }
}

Entities.createRootPrototypeEntity(TextureAtlasAsset);