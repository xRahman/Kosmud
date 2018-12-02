import { ZeroToOne } from "../../Shared/Utils/ZeroToOne";
import { Sound } from "../../Client/Engine/Sound";
import { Sprite } from "../../Client/Engine/Sprite";
import { FlightScene } from "../../Client/Flight/FlightScene";
import { GraphicContainer } from "../../Client/Engine/GraphicContainer";
import { Tilemap } from "../../Client/Engine/Tilemap";

export class ExhaustModel
{
  private readonly sprites: Array<Sprite>;
  private readonly sound: Sound;

  constructor
  (
    config: ExhaustModel.Config,
    tilemapObjectName: string,
    exhaustSoundBaseVolume: ZeroToOne
  )
  {
    this.sprites = createSprites(config, tilemapObjectName);

    this.sound = createSound(config, exhaustSoundBaseVolume);
  }

  // ---------------- Public methods --------------------

  public update(scale: ZeroToOne)
  {
    if (scale.valueOf() <= 0.01)
    {
      this.sound.pause();

      this.hideSprites();
    }
    else
    {
      this.sound.setVolume(scale);
      this.sound.resume();

      this.showAndScaleSprites(scale.valueOf());
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

// ----------------- Auxiliary Functions ---------------------

function createSprites(config: ExhaustModel.Config, tilemapObjectName: string)
: Array<Sprite>
{
  return config.tilemap.createSprites
  (
    config.scene,
    config.tilemapObjectLayerName,
    tilemapObjectName,
    {
      animationName: config.exhaustAnimationName,
      graphicContainer: config.graphicContainer,
      // This allows us to scale exhausts animations from the
      // start rather than from the middle.
      origin: { x: 0, y: 0.5 },
      textureOrAtlasId: config.exhaustTextureOrAtlasId
    }
  );
}

function createSound
(
  config: ExhaustModel.Config,
  exhaustSoundBaseVolume: ZeroToOne
)
{
  const sound = config.scene.createSound
  (
    config.exhaustSoundId, exhaustSoundBaseVolume
  );

  sound.play(true, new ZeroToOne(1));

  return sound;
}

// ------------------ Type Declarations ----------------------

export namespace ExhaustModel
{
  export interface Config
  {
    scene: FlightScene;
    tilemap: Tilemap;
    tilemapObjectLayerName: string;
    exhaustTextureOrAtlasId: string;
    graphicContainer: GraphicContainer;
    exhaustAnimationName: string;
    exhaustSoundId: string;
  }
}