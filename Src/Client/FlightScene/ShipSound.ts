import { Sound } from "../Phaser/Sound";

export class ShipSound
{
  constructor(private readonly scene: Phaser.Scene) {}

  // ------------- Public static methods ----------------

  public static preload(scene: Phaser.Scene)
  {
    scene.load.audio("Sound_ShipEngine", "Sound/Ship/Engine/ShipEngine.mp3");
  }

  // ---------------- Public methods --------------------

  public createExhaustSound(baseVolume0to1: number)
  {
    // return new Sound(this.scene, "Sound_ShipEngine2", baseVolume0to1);
    const sound = new Sound(this.scene, "Sound_ShipEngine3", baseVolume0to1);

    sound.play(true, 1);

    return sound;
  }
}