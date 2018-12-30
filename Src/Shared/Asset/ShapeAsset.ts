/*
  Part of Kosmud

  Shared Ship class ancestor.
*/

import { TilemapAsset } from "../../Shared/Asset/TilemapAsset";
import { Entities } from "../../Shared/Class/Entities";
import { Asset } from "../../Shared/Asset/Asset";

export class ShapeAsset extends Asset
{
  public tilemapAsset: TilemapAsset | "Not assigned" = "Not assigned";
  public objectLayerName = "<missing object layer name>";
  public objectName = "<missing object name>";
}

Entities.createRootPrototypeEntity(ShapeAsset);