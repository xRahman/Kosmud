/*  Part of Kosmud  */

import { Asset } from "../../Shared/Asset/Asset";
import { Scene } from "../../Client/Engine/Scene";

export interface ClientAsset extends Asset
{
  load(scene: Scene): void;
}
