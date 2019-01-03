/*
  Part of Kosmud

  Wraps Phaser.Tilemaps.StaticTilemapLayer
*/

import { Scene } from "../../Client/Engine/Scene";
import { PhaserObject } from "../../Client/Engine/PhaserObject";

export class StaticTilemapLayer extends PhaserObject
{
  // StaticTilemapLayer is not actually inherited from
  // Phaser.GameObjects.GameObject (according to Paser
  // documentation) but it seems that it has the same
  // properties so we can consider it to be so.
  protected phaserObject: Phaser.Tilemaps.StaticTilemapLayer;

  constructor
  (
    x: number,
    y: number,
    tilemapLayerName: string,
    tileset: Phaser.Tilemaps.Tileset,
    tilemap: Phaser.Tilemaps.Tilemap
  )
  {
    super();

    this.phaserObject = tilemap.createStaticLayer
    (
      tilemapLayerName,
      tileset,
      x, y
    );

    // if (scene.animatedTilesPlugin !== "Not loaded")
    // {
    //   scene.animatedTilesPlugin.init(map);
    //   // console.log(scene.animatedTilesPlugin);
    // }
  }

  // ---------------- Public methods --------------------
}