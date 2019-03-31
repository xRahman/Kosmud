/*  Part of Kosmud  */

import { SoundDescriptor } from "../../Shared/Asset/SoundDescriptor";
import { Asset } from "../../Shared/Asset/Asset";

export interface SoundAsset extends Asset
{
  readonly descriptor: SoundDescriptor;
}