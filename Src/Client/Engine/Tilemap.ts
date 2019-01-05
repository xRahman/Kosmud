/*
  Part of Kosmud

  Wraps Phaser.Tilemaps.Tilemap
*/

/*
  Note:
    This class is not a graphic element, it only stores tilemap data.
*/

import { Coords } from "../../Shared/Engine/Coords";
// import { Zone } from "../../Shared/Game/Zone";
import { TilemapAsset } from "../../Client/Asset/TilemapAsset";
import { Scene } from "../../Client/Engine/Scene";
import { Sprite } from "../../Client/Engine/Sprite";
import * as Shared from "../../Shared/Engine/Tilemap";

export class Tilemap extends Shared.Tilemap
{
  private readonly phaserTilemap: Phaser.Tilemaps.Tilemap;

  constructor
  (
    scene: Scene.PhaserScene,
    tilemapAsset: TilemapAsset,
    tilemapJsonData: object
  )
  {
    super(tilemapAsset.getName(), tilemapJsonData);

    this.phaserTilemap = scene.make.tilemap({ key: tilemapAsset.getId() });
  }

  // ---------------- Public methods --------------------

  public createSprites
  (
    scene: Scene,
    // Object layer name in Tiled editor.
    tilemapObjectLayerName: string,
    // Object name in Tiled editor.
    tilemapObjectName: string,
    config: Sprite.Config
  )
  : Array<Sprite>
  {
    const phaserSprites = this.phaserTilemap.createFromObjects
    (
      tilemapObjectLayerName,
      tilemapObjectName,
      { key: config.textureOrAtlasId }
    );

    const tileWidth = this.phaserTilemap.tileWidth;
    const tileHeight = this.phaserTilemap.tileHeight;
    const result: Array<Sprite> = [];

    for (let phaserSprite of phaserSprites)
    {
      // Translate by half the tile size because tiles in Tiled
      // editor have their origin at top left  but sprites in
      // Phaser engine have their origin  in the middle.
      phaserSprite = Coords.ClientToServer.tileObject
      (
        phaserSprite,
        tileWidth,
        tileHeight
      );

      const sprite = scene.createSprite(config, phaserSprite);

      result.push(sprite);
    }

    if (result.length === 0)
    {
      throw Error(`No sprites based on object name '${tilemapObjectName}'`
        + ` have been found in object layer '${tilemapObjectLayerName}' of`
        + ` tilemap '${this.getName()}'`);
    }

    return result;
  }
}