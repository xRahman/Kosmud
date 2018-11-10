import { Sound } from "../Phaser/Sound";

export class ShipSound
{
  constructor(private readonly scene: Phaser.Scene) {}

  // ------------- Public static methods ----------------

  public static preload(scene: Phaser.Scene)
  {
    scene.load.audio("Sound_ShipEngine1", "Sound/Ship/Engine/ShipEngine1.mp3");
    scene.load.audio("Sound_ShipEngine2", "Sound/Ship/Engine/ShipEngine2.mp3");
  }

  // ---------------- Public methods --------------------

  public createExhaustSound()
  {
    return new Sound(this.scene, "Sound_ShipEngine2");
  }
}