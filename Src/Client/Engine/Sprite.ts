/*
  Part of Kosmud

  Wraps Phaser.GameObjects.Sprite.
*/

import { Vector } from "../../Shared/Physics/Vector";
import { Scene } from "../../Client/Engine/Scene";
import { PhaserObject } from "../../Client/Engine/PhaserObject";

export class Sprite extends PhaserObject
{
  protected baseScaleX = 1;
  protected baseScaleY = 1;

  protected phaserObject: Phaser.GameObjects.Sprite;

  constructor
  (
    phaserScene: Scene.PhaserScene,
    config: Sprite.Config,
    phaserSprite?: Phaser.GameObjects.Sprite
  )
  {
    super();

    if (phaserSprite === undefined)
    {
      this.phaserObject = createPhaserSprite(phaserScene, config);
    }
    else
    {
      this.phaserObject = this.usePhaserSprite(phaserSprite, config);
    }

    this.applyConfig(config);
  }

  // ---------------- Public methods --------------------

  public getPixelWidth() { return this.phaserObject.width; }
  public getPixelHeight() { return this.phaserObject.height; }

  public setDisplaySize(pixelWidth: number, pixelHeight: number)
  {
    this.phaserObject.setDisplaySize(pixelWidth, pixelHeight);
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

  // --------------- Protected methods ------------------

  // ~ Overrides PhaserObject.applyConfig().
  protected applyConfig(config: Sprite.Config)
  {
    super.applyConfig(config);

    if (config.baseScaleX !== undefined)
      this.baseScaleX = config.baseScaleX;

    if (config.baseScaleY !== undefined)
      this.baseScaleY = config.baseScaleY;

    if (config.animationName !== undefined)
      this.playAnimation(config.animationName);

    if (config.origin !== undefined)
      this.setOrigin(config.origin);
  }

  // ---------------- Private methods -------------------

  private usePhaserSprite
  (
    sprite: Phaser.GameObjects.Sprite,
    config: Sprite.Config
  )
  {
    this.baseScaleX = sprite.scaleX;
    this.baseScaleY = sprite.scaleY;

    if (config.position !== undefined)
    {
      sprite.x = config.position.x;
      sprite.y = config.position.y;
    }

    return sprite;
  }

  private playAnimation(animationName: string)
  {
    this.phaserObject.anims.play(animationName);
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
}

// ----------------- Auxiliary Functions ---------------------

function createPhaserSprite
(
  phaserScene: Scene.PhaserScene,
  config: Sprite.Config
)
{
  return phaserScene.add.sprite
  (
    config.position ? config.position.x : 0,
    config.position ? config.position.y : 0,
    config.textureOrAtlasId
  );
}

// ------------------ Type Declarations ----------------------

export namespace Sprite
{
  export interface Config extends PhaserObject.Config
  {
    textureOrAtlasId: string;
    baseScaleX?: number;
    baseScaleY?: number;
    origin?: { x: number; y: number };
    animationName?: string;
  }
}