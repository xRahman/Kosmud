/*
  Wraps Phaser.GameObjects.Sprite
*/

import { PhaserObject } from "../../Client/Phaser/PhaserObject";

export class Sprite extends PhaserObject
{
  protected phaserObject: Phaser.GameObjects.Sprite;

  constructor
  (
    scene: Phaser.Scene,
    x: number,
    y: number,
    textureId: string
  )
  {
    super(scene);

    this.phaserObject = scene.add.sprite(x, y, textureId);
  }

  // ---------------- Public methods --------------------

  public getWidth() { return this.phaserObject.width; }
  public getHeight() { return this.phaserObject.height; }

  public setDisplaySize(width: number, height: number)
  {
    this.phaserObject.setDisplaySize(width, height);
  }
}