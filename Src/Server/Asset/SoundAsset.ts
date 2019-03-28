/*  Part of Kosmud  */

import { Entities } from "../../Server/Class/Entities";
import { SoundDescriptor } from "../../Shared/Asset/SoundDescriptor";
import { ServerAsset } from "../../Server/Asset/ServerAsset";

export class SoundAsset extends ServerAsset
{
  protected static version = 0;

  protected descriptor = new SoundDescriptor();

  // ~ Overrides ServerAsset.load().
  public async load()
  {
    // Nothing here (sounds are not loaded on the server).
  }

  // ~ Overrides ServerAsset.init().
  public init()
  {
    // Nothing here (sounds don't need init on the server).
  }
}

Entities.createRootPrototypeEntity(SoundAsset);