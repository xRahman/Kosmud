/*  Part of Kosmud  */

import { TilemapDescriptor } from "../../Shared/Asset/TilemapDescriptor";
import { Asset } from "../../Shared/Asset/Asset";

export interface TilemapAsset extends Asset
{
  readonly descriptor: TilemapDescriptor;
}