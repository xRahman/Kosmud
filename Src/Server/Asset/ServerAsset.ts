/*  Part of Kosmud  */

import { Asset } from "../../Shared/Asset/Asset";

export abstract class ServerAsset extends Asset
{
  public abstract async load(): Promise<void>;

  public abstract init(): void;
}
