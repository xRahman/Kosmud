/*
  Part of Kosmud

  Shared Ship class ancestor.
*/

import { Entities } from "../../Shared/Class/Entities";
import { Asset } from "../../Shared/Asset/Asset";

export class TilemapAsset extends Asset
{
  public path = "<missing file path>";
}

Entities.createRootPrototypeEntity(TilemapAsset);