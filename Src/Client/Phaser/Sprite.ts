/*
  Wraps Phaser.GameObjects.Sprite
*/

import { Container } from "../../Client/Phaser/Container";
import { PhaserObject } from "../../Client/Phaser/PhaserObject";

export class Sprite extends PhaserObject
{
  protected phaserObject: Phaser.GameObjects.Sprite;

  constructor
  (
    scene: Phaser.Scene,
    position: { x: number; y: number },
    rotation: number,
    textureId: string,
    {
      animation,
      container
    }:
    {
      animation?: Sprite.Animation;
      container?: Container;
    } = {}
  )
  {
    super(scene);

    if (animation !== undefined)
    {
      this.phaserObject = createSprite(scene, position, rotation, textureId);

      createAnimation(scene, textureId, animation);

      this.phaserObject.anims.play(animation.name);
    }
    else
    {
      this.phaserObject = createSprite(scene, position, rotation, textureId);
    }

    if (container !== undefined)
      container.add(this);
  }

  // ---------------- Public methods --------------------

  public getWidth() { return this.phaserObject.width; }
  public getHeight() { return this.phaserObject.height; }

  public setDisplaySize(width: number, height: number)
  {
    this.phaserObject.setDisplaySize(width, height);
  }

  public setScale(scale: number)
  {
    this.phaserObject.setScale(scale);
  }

  public setScaleX(scale: number)
  {
    this.phaserObject.scaleX = scale;
  }

  public setScaleY(scale: number)
  {
    this.phaserObject.scaleY = scale;
  }
}

// ------------------ Type Declarations ----------------------

export namespace Sprite
{
  export type Animation =
  {
    name: string;
    pathInTextureAtlas: string;
    numberOfFrames: number;
    frameRate: number;
  };
}

// ----------------- Auxiliary Functions ---------------------

function createSprite
(
  scene: Phaser.Scene,
  position: { x: number; y: number },
  rotation: number,
  textureId: string
)
{
  const sprite = scene.add.sprite
  (
    position.x,
    position.y,
    textureId
  );

  sprite.setRotation(rotation);

  return sprite;
}

function createAnimation
(
  scene: Phaser.Scene,
  textureId: string,
  animation: Sprite.Animation
)
{
  const INFINITE = -1;
  const frameNames = generateFrameNames(scene, textureId, animation);

  scene.anims.create
  (
    {
      // key: "animation_exhausts00",
      key: animation.name,
      frames: frameNames,
      // frameRate: 10,
      frameRate: animation.frameRate,
      repeat: INFINITE
    }
  );
}

function generateFrameNames
(
  scene: Phaser.Scene,
  textureId: string,
  animation: Sprite.Animation
)
{
  // Use names like "001.png"
  const THREE_PLACES = 3;

  return scene.anims.generateFrameNames
  (
    textureId,
    {
      start: 1,
      end: animation.numberOfFrames,
      zeroPad: THREE_PLACES,
      prefix: animation.pathInTextureAtlas,
      suffix: ".png"
    }
  );
}