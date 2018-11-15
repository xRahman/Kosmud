/*
  Wraps Phaser.GameObjects.Sprite
*/

import { Scene } from "../../Client/Phaser/Scene";
import { Container } from "../../Client/Phaser/Container";
import { PhaserObject } from "../../Client/Phaser/PhaserObject";

interface SpriteConfig
{
  position: { x: number; y: number };
  rotation: number;
  textureOrAtlasId: string;
}

interface SpriteOptions
{
  baseScale?: number;
  animation?: Sprite.Animation;
  container?: Container;
}

export class Sprite extends PhaserObject
{
  protected baseScale = 1;
  protected phaserObject: Phaser.GameObjects.Sprite;

  constructor
  (
    scene: Scene,
    spriteOrConfig: Phaser.GameObjects.Sprite | SpriteConfig,
    options: SpriteOptions = {}
  )
  {
    super(scene);

    if (spriteOrConfig instanceof Phaser.GameObjects.Sprite)
    {
      this.phaserObject = spriteOrConfig;
    }
    else
    {
      this.phaserObject = createSprite(scene, spriteOrConfig);
    }

    this.applyOptions(scene, options);
  }

/*
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

    this.phaserObject = createSprite(scene, position, rotation, textureId);

    if (animation !== undefined)
    {
      createAnimation(scene, textureId, animation);

      this.phaserObject.anims.play(animation.name);
    }

    if (container !== undefined)
      container.add(this);

    if (baseScale !== undefined)
      this.setBaseScale(baseScale);
  }
*/

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

  // ---------------- Private methods -------------------

  private playAnimation(animationName: string)
  {
    this.phaserObject.anims.play(animationName);
  }

  private applyOptions
  (
    scene: Scene,
    {
      baseScale,
      animation,
      container
    }:
    {
      baseScale?: number;
      animation?: Sprite.Animation;
      container?: Container;
    }
  )
  {
    if (animation !== undefined)
    {
      createAnimation(scene, animation);

      this.playAnimation(animation.name);
    }

    if (container !== undefined)
      container.add(this);

    if (baseScale !== undefined)
      this.setBaseScale(baseScale);
  }
}

// ------------------ Type Declarations ----------------------

export namespace Sprite
{
  export type Animation =
  {
    name: string;
    textureAtlasId: string;
    pathInTextureAtlas: string;
    numberOfFrames: number;
    frameRate: number;
  };
}

// ----------------- Auxiliary Functions ---------------------

function createSprite
(
  scene: Phaser.Scene,
  config: SpriteConfig
)
{
  const sprite = scene.add.sprite
  (
    config.position.x,
    config.position.y,
    config.textureOrAtlasId
  );

  sprite.setRotation(config.rotation);

  return sprite;
}

function createAnimation
(
  scene: Phaser.Scene,
  animation: Sprite.Animation
)
{
  const INFINITE = -1;
  const frameNames = generateFrameNames(scene, animation);

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

function generateFrameNames(scene: Phaser.Scene, animation: Sprite.Animation)
{
  // Use names like "001.png"
  const THREE_PLACES = 3;

  return scene.anims.generateFrameNames
  (
    animation.textureAtlasId,
    {
      start: 1,
      end: animation.numberOfFrames,
      zeroPad: THREE_PLACES,
      prefix: animation.pathInTextureAtlas,
      suffix: ".png"
    }
  );
}