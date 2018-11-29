/*
  Part of Kosmud

  Wraps Phaser.GameObjects.Container
*/

import { Scene } from "../../Client/Engine/Scene";
import { PhaserObject } from "../../Client/Engine/PhaserObject";

export class GraphicContainer extends PhaserObject
{
  protected phaserObject: Phaser.GameObjects.Container;

  constructor(scene: Scene, config: PhaserObject.Config = {})
  {
    super(scene);

    this.phaserObject = scene.createContainer(config);
  }

  // ---------------- Public methods --------------------

  public add(gameObject: Phaser.GameObjects.GameObject)
  {
    this.phaserObject.add(gameObject);
  }
}

// ------------------ Type Declarations ----------------------

export namespace GraphicContainer
{
  export interface Config extends PhaserObject.Config
  {
  }
}