import { Scene } from "../../Client/Engine/Scene";
import { Sound } from "../../Client/Engine/Sound";

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

  public createExhaustSound(baseVolume0to1: number)
  {
    const sound = new Sound(this.scene, this.exhaustSoundId, baseVolume0to1);

    sound.play(true, 1);

    return sound;
  }
}