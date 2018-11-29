/*
  Part of Kosmud

  Wraps Phaser.Sound.BaseSound
  /// Teda az na to, ze chci nastavovat volume, ktera v BaseSound neni...
*/

import { Scene } from "../../Client/Engine/Scene";

export class Sound
{
  protected baseVolume = 1;   // Number between 0 and 1.

  private readonly phaserSound: Phaser.Sound.BaseSound;

  constructor
  (
    scene: Scene.PhaserScene,
    soundId: string,
    baseVolume = 1
  )
  {
    this.phaserSound = createPhaserSound(scene, soundId);

    this.setBaseVolume(baseVolume);
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

  // ! Throws exception on error.
  public setBaseVolume(baseVolume: number)
  {
    if (baseVolume < 0 || baseVolume > 1)
    {
      throw new Error(`Base volume needs to be in <0, 1> interval`);
    }

    // Prevent possible division by zero.
    const oldbaseVolume =
      (this.baseVolume !== 0) ? this.baseVolume : 1;

    this.baseVolume = baseVolume;

    this.setVolume(this.getVolume() * baseVolume / oldbaseVolume);
  }

  public setVolume(volume: number)
  {
    if (volume < 0 || volume > 1)
    {
      throw new Error(`Volume needs to be in <0, 1> interval`);
    }

    /// Tohle je hack - v Phaser.Sound.BaseSound není property
    /// volume, ale používáme nejspíš webaudio, kde ta property je.
    ///   Zrada: "volume" je setter, takže i když existuje, může to
    /// spadnout na přístupu na "volumeNode".
    if ("volume" in this.phaserSound && "volumeNode" in this.phaserSound)
    {
      // tslint:disable-next-line:no-string-literal
      (this.phaserSound as any)["volume"] = volume * this.baseVolume;
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

function createPhaserSound
(
  scene: Scene.PhaserScene,
  soundId: string
)
{
  return scene.sound.add(soundId);
}