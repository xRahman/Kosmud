/*
  This class is not a graphic element, it only stores tilemap data.
*/

import { Scene } from "../../Client/Phaser/Scene";
import { Sprite } from "../../Client/Phaser/Sprite";
import * as Shared from "../../Shared/Physics/Tilemap";

export class Tilemap extends Shared.Tilemap
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
    super();

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
      const sprite = new Sprite
      (
        this.scene,
        phaserSprite,
        options
      );

      result.push(sprite);
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