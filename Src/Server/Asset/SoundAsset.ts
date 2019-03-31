/*  Part of Kosmud  */

import { Entities } from "../../Server/Class/Entities";
import { SoundDescriptor } from "../../Shared/Asset/SoundDescriptor";
import { Asset } from "../../Server/Asset/Asset";

export class SoundAsset extends Asset
{
  public readonly descriptor = new SoundDescriptor();

  protected static version = 0;

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