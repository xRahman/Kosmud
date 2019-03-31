/*  Part of Kosmud  */

import * as Shared from "../../Shared/Asset/Asset";

export abstract class Asset extends Shared.Asset
{
  public abstract async load(): Promise<void>;

  public abstract init(): void;
}
