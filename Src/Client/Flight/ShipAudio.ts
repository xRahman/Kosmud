import { Scene } from "../../Client/Engine/Scene";
import { Sound } from "../../Client/Engine/Sound";
import { ZeroToOne } from "../../Shared/Utils/ZeroToOne";

export class ShipAudio
{

  constructor
  (
    private readonly scene: Scene,
    private readonly exhaustSoundId: string
  )
  {
  }

  // ---------------- Public methods --------------------

  public createExhaustSound(baseVolume: ZeroToOne)
  {
    const sound = this.scene.createSound(this.exhaustSoundId, baseVolume);

    sound.play(true, 1);

    return sound;
  }
}