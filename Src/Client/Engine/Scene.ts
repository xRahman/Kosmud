/*
  Part of Kosmud

  Wraps Phaser.GameObjects.Container
*/

/*
  Notes:
    It would be easier to just extend Phaser.Scene but since all other
    Client/Engine classes are wrappers, Scene is a wrapper too.
*/

import { Sprite } from "../../Client/Engine/Sprite";
import { SceneContents } from "../../Client/Engine/SceneContents";

const INFINITE_REPEAT = -1;

interface PhaserScene extends Phaser.Scene
{
  preload?(): void;
  create?(): void;
}

export abstract class Scene
{
  protected width = 0;
  protected height = 0;
  protected contents: SceneContents | "Doesn't exist" = "Doesn't exist";
  protected phaserScene: PhaserScene;

  constructor(protected name: string)
  {
    this.phaserScene = new Phaser.Scene(name);

    this.phaserScene.preload = () => { this.preload(); };
    this.phaserScene.create = () => { this.create(); };
    this.phaserScene.update = () => { this.update(); };
  }

  // ---------------- Public methods --------------------

  public addToPhaserGame(phaserGame: Phaser.Game)
  {
    phaserGame.scene.add(this.name, this.phaserScene);
  }

  public start(phaserGame: Phaser.Game)
  {
    phaserGame.scene.start(this.name);
  }

  // This method is run by Phaser.
  public abstract preload(): void;

  // This method is run by Phaser.
  public abstract create(): void;

  // This method is run periodically by Phaser.
  public abstract update(): void;

  public resize(width: number, height: number)
  {
    this.width = width;
    this.height = height;
  }

  public preloadTexture(textureId: string, textureFilePath: string)
  {
    this.phaserScene.load.image(textureId, textureFilePath);
  }

  public preloadTextureAtlas
  (
    atlasId: string,
    atlasJsonFilePath: string,
    texturesDirectory: string
  )
  {
    this.phaserScene.load.multiatlas
    (
      atlasId,
      atlasJsonFilePath,
      texturesDirectory
    );
  }

  public preloadTilemap(tilemapDataId: string, tilemapJsonFilePath: string)
  {
    this.phaserScene.load.tilemapTiledJSON(tilemapDataId, tilemapJsonFilePath);
  }

  public preloadScenePlugin
  (
    config: Phaser.Loader.FileTypes.ScenePluginFileConfig
  )
  {
    this.phaserScene.load.scenePlugin(config);
  }

  public preloadSound(audioId: string, path: string)
  {
    this.phaserScene.load.audio(audioId, path);
  }

  public createContainer(position: { x: number; y: number })
  {
    return this.phaserScene.add.container(position.x, position.y);
  }

  public createGraphics(position: { x: number; y: number })
  {
    return this.phaserScene.add.graphics(position);
  }

  public createSprite
  (
    position: { x: number; y: number },
    rotation: number,
    textureOrAtlasId: string
  )
  {
    const sprite = this.phaserScene.add.sprite
    (
      position.x,
      position.y,
      textureOrAtlasId
    );

    sprite.setRotation(rotation);

    return sprite;
  }

  public createTilemap(tilemapJsonDataId: string)
  {
    return this.phaserScene.make.tilemap({ key: tilemapJsonDataId });
  }

  // ! Throws exception on error.
  public createAnimation(animation: Sprite.Animation, repeat = INFINITE_REPEAT)
  {
    // ! Throws exception on error.
    const frameNames = this.generateFrameNames(animation);

    this.phaserScene.anims.create
    (
      {
        key: animation.name,
        frames: frameNames,
        frameRate: animation.frameRate,
        repeat
      }
    );
  }

  public createSound(soundId: string)
  {
    return this.phaserScene.sound.add(soundId);
  }

  // ! Throws exception on error.
  public getTilemapJsonData(tilemapId: string)
  {
    const jsonData = this.phaserScene.cache.json.get(tilemapId);

    if (!jsonData || typeof jsonData !== "object")
    {
      throw new Error(`Failed to find tilemap json data for tilemap`
        + ` id '${tilemapId}'. Make sure that tilemap with this id`
        + ` is preloaded`);
    }

    return jsonData as object;
  }

  // ---------------- Private methods -------------------

  // ! Throws exception on error.
  private generateFrameNames(animation: Sprite.Animation)
  {
    if (animation.pathInTextureAtlas.slice(-1) !== "/")
    {
      throw new Error(`Failed to generate animation frame names because`
        + ` path '${animation.pathInTextureAtlas}' doesn't end with '/'`);
    }

    // Use names like "001.png"
    const THREE_PLACES = 3;

    return this.phaserScene.anims.generateFrameNames
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
}

// ------------------ Type Declarations ----------------------

export namespace Scene
{
  export const Z_ORDER_DEFAULT = 0;
}