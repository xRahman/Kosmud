/*  Part of Kosmud  */

import { Scene } from "../../Client/Engine/Scene";
import * as Shared from "../../Shared/Asset/Asset";

export abstract class Asset extends Shared.Asset
{
  public abstract load(scene: Scene): void;
}