/*  Part of Kosmud  */

import { TextureDescriptor } from "../../Shared/Asset/TextureDescriptor";
import { Asset } from "../../Shared/Asset/Asset";

export interface TextureAsset extends Asset
{
  readonly descriptor: TextureDescriptor;
}