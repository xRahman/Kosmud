/*  Part of Kosmud  */

import { Scene } from "../../Client/Engine/Scene";
import { Entities } from "../../Shared/Class/Entities";
import { ClientAsset } from "../../Client/Asset/ClientAsset";
import * as Shared from "../../Shared/Asset/SoundAsset";

export class SoundAsset extends Shared.SoundAsset implements ClientAsset
{
  public load(scene: Scene)
  {
    scene.loadSound(this.getId(), this.path);
  }
}

Entities.createRootPrototypeEntity(SoundAsset);