/*  Part of Kosmud  */

import { Entities } from "../../Shared/Class/Entities";
import { Asset } from "../../Shared/Asset/Asset";

export class TextureAtlasAsset extends Asset
{
  public path = "<missing file path>";
  public textureDirectory = "<missing texture directory>";
}

Entities.createRootPrototypeEntity(TextureAtlasAsset);