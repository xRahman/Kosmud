import { Scene } from "../../Client/Engine/Scene";
import { Sound } from "../../Client/Engine/Sound";

const SHIP_ENGINE_SOUND = "Ship Engine Sound";

export class ShipAudio
{
  constructor(private readonly scene: Scene) {}

  // ------------- Public static methods ----------------

  public static preload(scene: Scene)
  {
    scene.loadSound(SHIP_ENGINE_SOUND, "Sound/Ship/Engine/ShipEngine.mp3");
  }

  // ---------------- Public methods --------------------

  public createExhaustSound(baseVolume0to1: number)
  {
    const sound = new Sound(this.scene, SHIP_ENGINE_SOUND, baseVolume0to1);

    sound.play(true, 1);

    return sound;
  }
}