/*  Part of Kosmud  */

import { Entities } from "../../Server/Class/Entities";
import { ServerAsset } from "../../Server/Asset/ServerAsset";
import * as Shared from "../../Shared/Asset/SoundAsset";

export class SoundAsset extends Shared.SoundAsset implements ServerAsset
{
  // public async load()
  // {
  //   // Sounds are not loaded on the server.
  // }
}

Entities.createRootPrototypeEntity(SoundAsset);