/*
  Wraps Phaser.GameObjects.Sprite.
*/

import { Vector } from "../../Shared/Physics/Vector";
import { Scene } from "../../Client/Phaser/Scene";
import { Container } from "../../Client/Phaser/Container";
import { PhaserObject } from "../../Client/Phaser/PhaserObject";

const INFINITE_REPEAT = -1;

export class Sprite extends PhaserObject
{
  protected baseScaleX = 1;
  protected baseScaleY = 1;

  protected phaserObject: Phaser.GameObjects.Sprite;

  constructor
  (
    scene: Scene,
    spriteOrConfig: Phaser.GameObjects.Sprite | Sprite.Config,
    options: Sprite.Options = {}
  )
  {
    super(scene);

    if (spriteOrConfig instanceof Phaser.GameObjects.Sprite)
    {
      this.phaserObject = spriteOrConfig;

      this.baseScaleX = this.getScaleX();
      this.baseScaleY = this.getScaleY();
    }
    else
    {
      this.phaserObject = this.createPhaserSprite(spriteOrConfig);
    }

    this.applyOptions(options);
  }

  // ------------- Public static methods ----------------

  // ! Throws exception on error.
  public static createAnimation
  (
    scene: Phaser.Scene,
    animation: Sprite.Animation,
    repeat = INFINITE_REPEAT
  )
  {
    // ! Throws exception on error.
    const frameNames = generateFrameNames(scene, animation);

    scene.anims.create
    (
      {
        key: animation.name,
        frames: frameNames,
        frameRate: animation.frameRate,
        repeat
      }
    );
  }

  // ---------------- Public methods --------------------

  public getWidth() { return this.phaserObject.width; }
  public getHeight() { return this.phaserObject.height; }

  public setDisplaySize(width: number, height: number)
  {
    this.phaserObject.setDisplaySize(width, height);
  }

  public getScaleX() { return this.phaserObject.scaleX; }
  public getScaleY() { return this.phaserObject.scaleY; }

  public setScale(scale: number)
  {
    this.phaserObject.scaleX = scale * this.baseScaleX;
    this.phaserObject.scaleY = scale * this.baseScaleY;
  }

  public setScaleX(scale: number)
  {
    this.phaserObject.scaleX = scale * this.baseScaleX;
  }

  public setScaleY(scale: number)
  {
    this.phaserObject.scaleY = scale * this.baseScaleY;
  }

  // ---------------- Private methods -------------------

  private playAnimation(animationName: string)
  {
    this.phaserObject.anims.play(animationName);
  }

  private applyOptions(options: Sprite.Options)
  {
    if (options.animationName !== undefined)
      this.playAnimation(options.animationName);

    if (options.container !== undefined)
      options.container.add(this);

    if (options.origin)
      this.setOrigin(options.origin);
  }

  private setOrigin({ x, y }: { x: number; y: number })
  {
    const oldDisplayOriginX = this.phaserObject.displayOriginX;
    const oldDisplayOriginY = this.phaserObject.displayOriginY;

    // Note that changing display origin visually translates the sprite.
    this.phaserObject.setOrigin(x, y);

    let diffX = this.phaserObject.displayOriginX - oldDisplayOriginX;
    let diffY = this.phaserObject.displayOriginY - oldDisplayOriginY;

    diffX *= this.getScaleX();
    diffY *= this.getScaleY();

    const offset = new Vector({ x: diffX, y: diffY });

    offset.rotate(this.phaserObject.rotation);

    // Translate the sprite back to original visual position.
    this.phaserObject.x += offset.x;
    this.phaserObject.y += offset.y;
  }

  private createPhaserSprite(config: Sprite.Config)
  {
    const sprite = this.scene.add.sprite
    (
      config.position.x,
      config.position.y,
      config.textureOrAtlasId
    );

    sprite.setRotation(config.rotation);

    if (config.baseScaleX !== undefined)
      this.baseScaleX = config.baseScaleX;

    if (config.baseScaleY !== undefined)
      this.baseScaleY = config.baseScaleY;

    return sprite;
  }
}

// ----------------- Auxiliary Functions ---------------------

// ! Throws exception on error.
function generateFrameNames(scene: Phaser.Scene, animation: Sprite.Animation)
{
  if (animation.pathInTextureAtlas.slice(-1) !== "/")
  {
    throw new Error(`Failed to generate animation frame names because`
      + ` path '${animation.pathInTextureAtlas}' doesn't end with '/'`);
  }

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

// ------------------ Type Declarations ----------------------

export namespace Sprite
{
  export interface Animation
  {
    name: string;
    textureAtlasId: string;
    pathInTextureAtlas: string;
    numberOfFrames: number;
    frameRate: number;
  }

  export interface Config
  {
    position: { x: number; y: number };
    rotation: number;
    textureOrAtlasId: string;
    baseScaleX?: number;
    baseScaleY?: number;
  }

  export interface Options
  {
    animationName?: string;
    container?: Container;
    origin?: { x: number; y: number };
  }
}