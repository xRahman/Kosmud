/*
  Part of Kosmud

  Wraps Phaser.GameObjects.Container
*/

import { Scene } from "../../Client/Engine/Scene";
import { PhaserObject } from "../../Client/Engine/PhaserObject";

export class GraphicContainer extends PhaserObject
{
  protected phaserObject: Phaser.GameObjects.Container;

  constructor(scene: Scene, position = { x: 0, y: 0 })
  {
    super(scene);

    this.phaserObject = scene.createContainer(position);
  }

  // ---------------- Public methods --------------------

  public add(gameObject: Phaser.GameObjects.GameObject)
  {
    this.phaserObject.add(gameObject);
  }
}