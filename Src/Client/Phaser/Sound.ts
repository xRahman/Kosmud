/*
  Wraps Phaser.Sound.BaseSound
  /// Teda az na to, ze chci nastavovat volume, ktera v BaseSound neni...
*/

export class Sound
{
  private readonly phaserSound: Phaser.Sound.BaseSound;

  constructor
  (
    scene: Phaser.Scene,
    soundId: string
  )
  {
    this.phaserSound = createSound(scene, soundId);
  }

  // ---------------- Public methods --------------------

  public play(loop: boolean, volume0to1: number)
  {
    this.phaserSound.play("", { loop, volume: volume0to1 });
  }

  public stop()
  {
    this.phaserSound.stop();
  }

  public setVolume(volume0to1: number)
  {
    /// Tohle je hack - v Phaser.Sound.BaseSound není property
    /// volume, ale používáme nejspíš webaudio, kde ta property je.
    if ("volume" in this.phaserSound)
    {
      // tslint:disable-next-line:no-string-literal
      (this.phaserSound as any)["volume"] = volume0to1;
    }
  }
}

// ----------------- Auxiliary Functions ---------------------

function createSound
(
  scene: Phaser.Scene,
  soundId: string
)
{
  return scene.sound.add(soundId);
}