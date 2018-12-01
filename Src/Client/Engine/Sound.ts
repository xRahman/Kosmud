/*
  Part of Kosmud

  Wraps Phaser.Sound.BaseSound
  /// Teda az na to, ze chci nastavovat volume, ktera v BaseSound neni...
*/

import { ZeroToOne } from "../../Shared/Utils/ZeroToOne";
import { Scene } from "../../Client/Engine/Scene";

export class Sound
{
  protected baseVolume = new ZeroToOne(1);

  private readonly phaserSound: Phaser.Sound.BaseSound;

  constructor
  (
    phaserScene: Scene.PhaserScene,
    soundId: string,
    baseVolume = new ZeroToOne(1)
  )
  {
    this.phaserSound = createPhaserSound(phaserScene, soundId);

    this.setBaseVolume(baseVolume);
  }

  // ---------------- Public methods --------------------

  public isPaused()
  {
    return this.phaserSound.isPaused;
  }

  public pause()
  {
    this.phaserSound.pause();
  }

  public resume()
  {
    this.phaserSound.resume();
  }

  public play(loop: boolean, volume0to1: number)
  {
    this.phaserSound.play("", { loop, volume: volume0to1 });
  }

  public stop()
  {
    this.phaserSound.stop();
  }

  // ! Throws exception on error.
  public setBaseVolume(baseVolume: ZeroToOne)
  {
    const oldbaseVolumeValue = this.baseVolume.valueOf();
    const newBaseVolumeValue = baseVolume.valueOf();

    let newVolumeValue = this.getVolume().valueOf();
    if (oldbaseVolumeValue !== 0)
      newVolumeValue = newBaseVolumeValue / oldbaseVolumeValue;

    this.setVolume(new ZeroToOne(newVolumeValue));
    this.baseVolume = baseVolume;
  }

  public setVolume(volume: ZeroToOne)
  {
    const value = volume.valueOf();
    const baseValue = this.baseVolume.valueOf();

    /// Tohle je hack - v Phaser.Sound.BaseSound není property
    /// volume, ale používáme nejspíš webaudio, kde ta property je.
    ///   Zrada: "volume" je setter, takže i když existuje, může to
    /// spadnout na přístupu na "volumeNode".
    if ("volume" in this.phaserSound && "volumeNode" in this.phaserSound)
    {
      // tslint:disable-next-line:no-string-literal
      (this.phaserSound as any)["volume"] = value * baseValue;
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
      const volume = ((this.phaserSound as any)["volume"] as number);

      return new ZeroToOne(volume);
    }

    return new ZeroToOne(1);
  }
}

// ----------------- Auxiliary Functions ---------------------

function createPhaserSound
(
  phaserScene: Scene.PhaserScene,
  soundId: string
)
{
  return phaserScene.sound.add(soundId);
}