import { Sound } from "../Phaser/Sound";

const SHIP_ENGINE_SOUND = "Ship Engine Sound";

export class ShipSound
{
  constructor(private readonly scene: Phaser.Scene) {}

  // ------------- Public static methods ----------------

  public static preload(scene: Phaser.Scene)
  {
    scene.load.audio(SHIP_ENGINE_SOUND, "Sound/Ship/Engine/ShipEngine.mp3");
  }

  // ---------------- Public methods --------------------

  public createExhaustSound(baseVolume0to1: number)
  {
    // return new Sound(this.scene, "Sound_ShipEngine2", baseVolume0to1);
    const sound = new Sound(this.scene, SHIP_ENGINE_SOUND, baseVolume0to1);

    sound.play(true, 1);

    return sound;
  }
}