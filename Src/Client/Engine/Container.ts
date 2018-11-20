/*
  Wraps Phaser.GameObjects.Container
*/

import { PhaserObject } from "../../Client/Engine/PhaserObject";

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
}