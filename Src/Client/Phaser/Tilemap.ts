/*
  This class is not a graphic element, it only stores tilemap data.
*/

import { Scene } from "../../Client/Phaser/Scene";
import { Sprite } from "../../Client/Phaser/Sprite";

export class Tilemap
{
  private readonly tilemap: Phaser.Tilemaps.Tilemap;

  constructor
  (
    private readonly scene: Scene,
    private readonly name: string,
    // String id of preloaded tilemap json data.
    tilemapJsonDataId: string
  )
  {
    this.tilemap = scene.make.tilemap({ key: tilemapJsonDataId });
  }

  // ---------------- Public methods --------------------

  // ! Throws exception on error.
  public createSprites
  (
    // Object layer name in Tiled editor.
    tilemapObjectLayerName: string,
    // Object name in Tiled editor.
    tilemapObjectName: string,
    // Id of texture or texture atlas to be used.
    textureOrAtlasId: string,
    options: Sprite.Options
  )
  : Array<Sprite>
  {
    const phaserSprites = this.tilemap.createFromObjects
    (
      tilemapObjectLayerName,
      tilemapObjectName,
      { key: textureOrAtlasId }
    );

    const result: Array<Sprite> = [];

    for (const phaserSprite of phaserSprites)
    {
      // /// TODO: Animation bych možná měl dostat jako argument
      // ///   (taky se to nemusí vůbec animovat).
      // const animation: Sprite.Animation =
      // {
      //   name: "TODO",
      //   textureAtlasId: textureOrAtlasId,
      //   pathInTextureAtlas: "TODO";
      //   numberOfFrames: number;
      //   frameRate: number;
      // };

      /// Tohle jsem vyřešil tím, že jsem to posunul v Tiled editoru
      /// na [-100, 100];
      // Phaser sprites have origin in the middle, Tiled tiles at top left.
      // So we need to correct it.
      // phaserSprite.setX(phaserSprite.x - this.tilemap.tileWidth / 2);
      // phaserSprite.setY(phaserSprite.y - this.tilemap.tileHeight / 2);

      console.log(phaserSprite);

      const sprite = new Sprite
      (
        this.scene,
        phaserSprite,
        options
      );

      result.push(sprite);

      // /// Tohle teď snad dělá konstructor Sprite classy.
  // this.container.addSprite(phaserSprite);

  // const frameNames = scene.anims.generateFrameNames
  // (
  //   ATLAS_EXHAUST_YELLOW_RECTANGULAR,
  //   {
  //     start: 1,
  //     end: 8, // animation.numberOfFrames,
  //     zeroPad: 3, // THREE_PLACES,
  //     prefix: "ExhaustYellowRectangular/", // animation.pathInTextureAtlas,
  //     /// Aha, já jsem asi v texture packeru vypnul přidávání suffixu
  //     /// - to možná nebyl úplně dobrej nápad.
  //     // suffix: ".png"
  //     suffix: ""
  //   }
  // );
    }

    if (result.length === 0)
    {
      throw new Error(`No sprites based on object name '${tilemapObjectName}'`
        + ` have been found in object layer '${tilemapObjectLayerName}' of`
        + ` tilemap '${this.name}'`);
    }

    return result;
  }
}