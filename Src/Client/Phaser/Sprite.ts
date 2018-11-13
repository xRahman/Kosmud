/*
  Wraps Phaser.GameObjects.Sprite
*/

import { Container } from "../../Client/Phaser/Container";
import { PhaserObject } from "../../Client/Phaser/PhaserObject";

export class Sprite extends PhaserObject
{
  protected baseScale = 1;
  protected phaserObject: Phaser.GameObjects.Sprite;

  constructor
  (
    scene: Phaser.Scene,
    position: { x: number; y: number },
    rotation: number,
    textureId: string,
    {
      baseScale,
      animation,
      container
    }:
    {
      baseScale?: number;
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

    if (baseScale !== undefined)
      this.setBaseScale(baseScale);
  }

  // ---------------- Public methods --------------------

  public getWidth() { return this.phaserObject.width; }
  public getHeight() { return this.phaserObject.height; }

  public setDisplaySize(width: number, height: number)
  {
    this.phaserObject.setDisplaySize(width, height);
  }

  public setBaseScale(baseScale: number)
  {
    // Prevent possible division by zero.
    const oldBaseScale = (this.baseScale !== 0) ? this.baseScale : 1;

    this.baseScale = baseScale;

    this.phaserObject.scaleX *= baseScale / oldBaseScale;
    this.phaserObject.scaleY *= baseScale / oldBaseScale;
  }

  public getBaseScale() { return this.baseScale; }

  public setScale(scale: number)
  {
    this.phaserObject.setScale(scale * this.baseScale);
  }

  public setScaleX(scale: number)
  {
    this.phaserObject.scaleX = scale * this.baseScale;
  }

  public setScaleY(scale: number)
  {
    this.phaserObject.scaleY = scale * this.baseScale;
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
      key: animation.name,
      frames: frameNames,
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