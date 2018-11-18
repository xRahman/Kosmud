/*
  Wraps Phaser.Tilemaps.StaticTilemapLayer.
*/

import { PhaserObject } from "../../Client/Phaser/PhaserObject";

export class StaticTilemapLayer extends PhaserObject
{
  // StaticTilemapLayer is not actually inherited from
  // Phaser.GameObjects.GameObject (according to Paser
  // documentation) but it seems that it has the same
  // properties so we can consider it to be so.
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