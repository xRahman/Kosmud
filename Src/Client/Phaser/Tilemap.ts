/*
  This class is not a graphic element, it only stores tilemap data.
*/

import { Scene } from "../../Client/Phaser/Scene";
import { Sprite } from "../../Client/Phaser/Sprite";
import { Container } from "../../Client/Phaser/Container";

export class Tilemap
{
  private readonly tilemap: Phaser.Tilemaps.Tilemap;

  constructor
  (
    private scene: Scene,
    // String id of preloaded tilemap json data.
    tilemapJsonDataId: string
  )
  {
    this.tilemap = scene.make.tilemap({ key: tilemapJsonDataId });
  }

  // ---------------- Public methods --------------------

  public createSpritesFromObjectLayer
  (
    // Object layer name in Tiled editor.
    objectLayerName: string,
    // Object name in Tiled editor.
    objectName: string,
    // Id of texture or texture atlas to be used.
    textureOrAtlasId: string,
    container?: Container
  )
  {
    const phaserSprites = this.tilemap.createFromObjects
    (
      objectLayerName,
      // Object name in Tiled editor.
      objectName,
      { key: textureOrAtlasId }
    );

    /// TODO: Nějak z těch spritů navyrábat Sprite objekty...
    /// - asi budu muset přetížit parametry konstruktoru ve Sprite.

    for (const phaserSprite of phaserSprites)
    {
      /// TODO: Animation bych možná měl dostat jako argument.
      const animation: Sprite.Animation =
      {
        name: "TODO",
        textureAtlasId
        pathInTextureAtlas: "TODO";
        numberOfFrames: number;
        frameRate: number;
      };

      const sprite = new Sprite
      (
        this.scene,
        phaserSprite,
        {
          animation,
          container
        }
      );

      /// Origin spritu v Phaseru je uprostřed, ale v Tiled vlevo nahoře.
      /// TODO: Vymyslet, odkud ta čísla brát
      ///   (jsou to asi půlky rozměrů ship layeru)
      phaserSprite.setX(phaserSprite.x - 190);
      phaserSprite.setY(phaserSprite.y - 190);
      this.container.addSprite(phaserSprite);

      const frameNames = scene.anims.generateFrameNames
      (
        ATLAS_EXHAUST_YELLOW_RECTANGULAR,
        {
          start: 1,
          end: 8, // animation.numberOfFrames,
          zeroPad: 3, // THREE_PLACES,
          prefix: "ExhaustYellowRectangular/", // animation.pathInTextureAtlas,
          /// Aha, já jsem asi v texture packeru vypnul přidávání suffixu
          /// - to možná nebyl úplně dobrej nápad.
          // suffix: ".png"
          suffix: ""
        }
      );
  }
}