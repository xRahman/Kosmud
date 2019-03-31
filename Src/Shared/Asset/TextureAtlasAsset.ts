/*  Part of Kosmud  */

import { TextureAtlasDescriptor } from
  "../../Shared/Asset/TextureAtlasDescriptor";
import { Asset } from "../../Shared/Asset/Asset";

export interface TextureAtlasAsset extends Asset
{
  readonly descriptor: TextureAtlasDescriptor;
}