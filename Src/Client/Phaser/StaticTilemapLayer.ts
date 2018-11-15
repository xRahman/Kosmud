/*
  Wraps Phaser.Tilemaps.StaticTilemapLayer.
*/

import { PhaserObject } from "../../Client/Phaser/PhaserObject";

export class StaticTilemapLayer extends PhaserObject
{
  protected phaserObject: Phaser.Tilemaps.StaticTilemapLayer;

  constructor
  (
    scene: Phaser.Scene,
    x: number,
    y: number,
    tilemapLayerName: string,
    tileset: Phaser.Tilemaps.Tileset,
    tilemap: Phaser.Tilemaps.Tilemap
  )
  {
    super(scene);

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