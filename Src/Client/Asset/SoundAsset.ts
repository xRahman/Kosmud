/*  Part of Kosmud  */

import { Scene } from "../../Client/Engine/Scene";
import { Entities } from "../../Shared/Class/Entities";
import { SoundDescriptor } from "../../Shared/Asset/SoundDescriptor";
import { ClientAsset } from "../../Client/Asset/ClientAsset";

export class SoundAsset extends ClientAsset
{
  public readonly descriptor = new SoundDescriptor();

  protected static version = 0;

  // ---------------- Public methods --------------------

  // ~ Overrides ClientAsset.load().
  public load(scene: Scene)
  {
    scene.loadSound(this.getId(), this.descriptor.path);
  }
}

Entities.createRootPrototypeEntity(SoundAsset);