/*
  Part of Kosmud

  Wraps Phaser.GameObjects.Container
*/

import { Scene } from "../../Client/Engine/Scene";
import { PhaserObject } from "../../Client/Engine/PhaserObject";

export class GraphicContainer extends PhaserObject
{
  protected phaserObject: Phaser.GameObjects.Container;

  constructor(phaserScene: Scene.PhaserScene, config: PhaserObject.Config)
  {
    super();

    this.phaserObject = createPhaserObjectContainer(phaserScene, config);

    this.applyConfig(config);
  }

  // ---------------- Public methods --------------------

  public add(gameObject: PhaserObject.GameObject)
  {
    this.phaserObject.add(gameObject);
  }
}

// ----------------- Auxiliary Functions ---------------------

function createPhaserObjectContainer
(
  phaserScene: Scene.PhaserScene,
  config: GraphicContainer.Config
)
{
  return phaserScene.add.container
  (
    config.position ? config.position.x : 0,
    config.position ? config.position.y : 0
  );
}

// ------------------ Type Declarations ----------------------

export namespace GraphicContainer
{
  export interface Config extends PhaserObject.Config
  {
  }
}