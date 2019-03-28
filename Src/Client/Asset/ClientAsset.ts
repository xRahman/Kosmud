/*  Part of Kosmud  */

import { Asset } from "../../Shared/Asset/Asset";
import { Scene } from "../../Client/Engine/Scene";

export abstract class ClientAsset extends Asset
{
  public abstract load(scene: Scene): void;
}