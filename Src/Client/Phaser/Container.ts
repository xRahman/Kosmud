/*
  Wraps Phaser.GameObjects.Container
*/

import { PhaserObject } from "../../Client/Phaser/PhaserObject";

export class Container extends PhaserObject
{
  protected phaserObject: Phaser.GameObjects.Container;

  constructor
  (
    scene: Phaser.Scene,
    x: number,
    y: number
  )
  {
    super(scene);

    this.phaserObject = scene.add.container(x, y);
  }

  // ---------------- Public methods --------------------

  public add(phaserObject: PhaserObject)
  {
    phaserObject.addToContainer(this.phaserObject);
  }

  // Dočasný hack.
  public addLayer(layer: Phaser.Tilemaps.StaticTilemapLayer)
  {
    this.phaserObject.add(layer);
  }
  public addSprite(sprite: Phaser.GameObjects.Sprite)
  {
    this.phaserObject.add(sprite);
  }
}