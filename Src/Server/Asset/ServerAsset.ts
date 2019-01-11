/*  Part of Kosmud  */

import { Asset } from "../../Shared/Asset/Asset";

export interface ServerAsset extends Asset
{
  load?(): Promise<void>;
  init?(): void;
}
