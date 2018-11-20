/*
  Wraps Phaser.Sound.BaseSound
  /// Teda az na to, ze chci nastavovat volume, ktera v BaseSound neni...
*/

export class Sound
{
  protected baseVolume0to1 = 1;

  private readonly phaserSound: Phaser.Sound.BaseSound;

  constructor
  (
    scene: Phaser.Scene,
    soundId: string,
    baseVolume0to1 = 1
  )
  {
    this.phaserSound = createSound(scene, soundId);

    this.setBaseVolume(baseVolume0to1);
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

  public setBaseVolume(baseVolume0to1: number)
  {
    // Prevent possible division by zero.
    const oldbaseVolume =
      (this.baseVolume0to1 !== 0) ? this.baseVolume0to1 : 1;

    this.baseVolume0to1 = baseVolume0to1;

    this.setVolume(this.getVolume() * baseVolume0to1 / oldbaseVolume);
  }

  public setVolume(volume0to1: number)
  {
    /// Tohle je hack - v Phaser.Sound.BaseSound není property
    /// volume, ale používáme nejspíš webaudio, kde ta property je.
    ///   Zrada: "volume" je setter, takže i když existuje, může to
    /// spadnout na přístupu na "volumeNode".
    if ("volume" in this.phaserSound && "volumeNode" in this.phaserSound)
    {
      // tslint:disable-next-line:no-string-literal
      (this.phaserSound as any)["volume"] = volume0to1 * this.baseVolume0to1;
    }
  }

  public getVolume()
  {
    /// Tohle je hack - v Phaser.Sound.BaseSound není property
    /// volume, ale používáme nejspíš webaudio, kde ta property je.
    ///   Zrada: "volume" je getter, takže i když existuje, může to
    /// spadnout na přístupu na "volumeNode".
    if ("volume" in this.phaserSound && "volumeNode" in this.phaserSound)
    {
      // tslint:disable-next-line:no-string-literal
      return ((this.phaserSound as any)["volume"] as number);
    }

    return 1;
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