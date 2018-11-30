import { ZeroToOne } from "../../Shared/Utils/ZeroToOne";
import { Sound } from "../../Client/Engine/Sound";
import { Sprite } from "../../Client/Engine/Sprite";
import { ShipAudio } from "../../Client/Flight/ShipAudio";
import { ShipModel } from "../../Client/Flight/ShipModel";

export class ShipExhaust
{
  private readonly sprites: Array<Sprite>;
  private readonly sound: Sound;

  // ! Throws exception on error.
  constructor
  (
    shipModel: ShipModel,
    shipAudio: ShipAudio,
    animationName: string,
    tilemapObjectName: string,
    volume: ZeroToOne
  )
  {
    // ! Throws exception on error.
    this.sprites = shipModel.createExhaustSprites
    (
      tilemapObjectName,
      animationName
    );

    this.sound = shipAudio.createExhaustSound(volume.value);
  }

  // ---------------- Public methods --------------------

  public update(scale: number)
  {
    if (scale <= 0.01)
    {
      this.sound.pause();

      this.hideSprites();
    }
    else
    {
      this.sound.setVolume(scale);
      this.sound.resume();

      this.showAndScaleSprites(scale);
    }
  }

  // ---------------- Private methods -------------------

  private hideSprites()
  {
    for (const sprite of this.sprites)
    {
      sprite.hide();
    }
  }

  private showAndScaleSprites(scale: number)
  {
    for (const sprite of this.sprites)
    {
      sprite.show();
      sprite.setScaleX(scale);
    }
  }
}