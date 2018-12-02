/*
  Part of Kosmud

  Wraps Phaser.GameObjects.Sprite.
*/

import { Scene } from "../../Client/Engine/Scene";

export class SpriteAnimation
{
  protected phaserAnimation: Phaser.Animations.Animation;

  constructor
  (
    phaserScene: Scene.PhaserScene,
    animationConfig: SpriteAnimation.Config
  )
  {
    // ! Throws exception on error.
    const frameNames = generateFrameNames(phaserScene, animationConfig);

    this.phaserAnimation = phaserScene.anims.create
    (
      {
        key: animationConfig.animationName,
        frames: frameNames,
        frameRate: animationConfig.frameRate,
        repeat: animationConfig.repeat
      }
    );
  }

  public pause()
  {
    this.phaserAnimation.pause();
  }

  public resume()
  {
    this.phaserAnimation.resume();
  }
}

// ----------------- Auxiliary Functions ---------------------

// ! Throws exception on error.
function generateFrameNames
(
  phaserScene: Phaser.Scene,
  animationConfig: SpriteAnimation.Config
)
{
  if (animationConfig.pathInTextureAtlas.slice(-1) !== "/")
  {
    throw new Error(`Failed to generate animation frame names because path`
      + ` '${animationConfig.pathInTextureAtlas}' doesn't end with '/'`);
  }

  // Use names like "001.png"
  const THREE_PLACES = 3;

  return phaserScene.anims.generateFrameNames
  (
    animationConfig.textureAtlasId,
    {
      start: 1,
      end: animationConfig.numberOfFrames,
      zeroPad: THREE_PLACES,
      prefix: animationConfig.pathInTextureAtlas,
      suffix: ".png"
    }
  );
}

// ------------------ Type Declarations ----------------------

export namespace SpriteAnimation
{
  export const INFINITE_REPEAT = -1;

  export interface Config
  {
    animationName: string;
    textureAtlasId: string;
    pathInTextureAtlas: string;
    numberOfFrames: number;
    frameRate: number;
    repeat: number;
  }
}