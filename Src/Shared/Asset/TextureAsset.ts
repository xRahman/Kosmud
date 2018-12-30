/*
  Part of Kosmud

  Shared Ship class ancestor.
*/

import { Entities } from "../../Shared/Class/Entities";
import { Asset } from "../../Shared/Asset/Asset";

export class TextureAsset extends Asset
{
  public path = "<missing file path>";
}

Entities.createRootPrototypeEntity(TextureAsset);