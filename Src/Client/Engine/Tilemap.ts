/*
  This class is not a graphic element, it only stores tilemap data.
*/

import { CoordsTransform } from "../../Shared/Physics/CoordsTransform";
import { Scene } from "../../Client/Engine/Scene";
import { Sprite } from "../../Client/Engine/Sprite";
import * as Shared from "../../Shared/Engine/Tilemap";

export class Tilemap extends Shared.Tilemap
{
  private readonly phaserTilemap: Phaser.Tilemaps.Tilemap;

  constructor
  (
    private readonly scene: Scene,
    name: string,
    // String id of preloaded tilemap json data.
    tilemapJsonDataId: string,
    tilemapJsonData: object
  )
  {
    super(name, tilemapJsonData);

    this.phaserTilemap = scene.createTilemap(tilemapJsonDataId);
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
    const phaserSprites = this.phaserTilemap.createFromObjects
    (
      tilemapObjectLayerName,
      tilemapObjectName,
      { key: textureOrAtlasId }
    );

    const tileWidth = this.phaserTilemap.tileWidth;
    const tileHeight = this.phaserTilemap.tileHeight;
    const result: Array<Sprite> = [];

    for (let phaserSprite of phaserSprites)
    {
      // Translate by half the tile size because tiles in Tiled
      // editor have their origin at top left  but sprites in
      // Phaser engine have their origin  in the middle.
      phaserSprite = CoordsTransform.transformTileObject
      (
        phaserSprite,
        tileWidth,
        tileHeight
      );

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
        + ` tilemap '${this.getName()}'`);
    }

    return result;
  }
}