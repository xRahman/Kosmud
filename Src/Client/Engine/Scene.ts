/*
  Part of Kosmud

  Wraps Phaser.GameObjects.Container
*/

/*
  Notes:
    It would be easier to just extend Phaser.Scene but since all other
    Client/Engine classes are wrappers, Scene is a wrapper too.
*/

import { ERROR } from "../../Shared/Log/ERROR";
import { REPORT } from "../../Shared/Log/REPORT";
import { Types } from "../../Shared/Utils/Types";
import { Sprite } from "../../Client/Engine/Sprite";
import { SceneContents } from "../../Client/Engine/SceneContents";
import { Renderer } from "../../Client/Engine/Renderer";

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

  protected active = false;

  private finishLoading: Types.ResolveFunction<void> | "Not loading"
    = "Not loading";

  constructor(protected name: string)
  {
    this.phaserScene = new Phaser.Scene(name);

    // It turns out that we do need to register preload() callback
    // even though we don't use it because if we don't, Phaser
    // will think that no loading is happening.
    this.phaserScene.preload = () => { this.onPreload(); };
    this.phaserScene.create = () => { this.onCreate(); };
    this.phaserScene.update = () => { this.onUpdate(); };
  }

  // ---------------- Public methods --------------------

  public get debugId()
  {
    return `{ ${this.constructor.name} '${this.name}' }`;
  }

  public getName() { return this.name; }

  public isActive()
  {
    return this.active;
  }

  public addToPhaserGame(phaserGame: Phaser.Game)
  {
    phaserGame.scene.add(this.name, this.phaserScene);
  }

  // ! Throws exception on error.
  public async load()
  {
    this.startLoading();

    // Here we wait for Phaser to call create() callback
    // (which means that loading is finished).
    await this.loadingIsFinished();
  }

  public resize(width: number, height: number)
  {
    this.width = width;
    this.height = height;
  }

  public loadTexture(textureId: string, textureFilePath: string)
  {
    this.phaserScene.load.image(textureId, textureFilePath);
  }

  public loadTextureAtlas
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

  public loadTilemap(tilemapDataId: string, tilemapJsonFilePath: string)
  {
    this.phaserScene.load.tilemapTiledJSON(tilemapDataId, tilemapJsonFilePath);
  }

  public loadScenePlugin
  (
    config: Phaser.Loader.FileTypes.ScenePluginFileConfig
  )
  {
    this.phaserScene.load.scenePlugin(config);
  }

  public loadSound(audioId: string, path: string)
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
    // Phaser loads tilemap json data so we don't have to do it again.
    const jsonData = this.phaserScene.cache.tilemap.get(tilemapId).data;

    if (!jsonData || typeof jsonData !== "object")
    {
      throw new Error(`Failed to find tilemap json data for tilemap`
        + ` id '${tilemapId}'. Make sure that tilemap with this id`
        + ` is loaded`);
    }

    return jsonData as object;
  }

  // --------------- Protected methods ------------------

  // ! Throws exception on error.
  // tslint:disable-next-line
  protected loadPlugins() {}

  // ! Throws exception on error.
  protected abstract loadAssets(): void;

  protected activate()
  {
    this.active = true;
  }

  protected deactivate()
  {
    this.active = false;
  }

  // ! Throws exception on error.
  // tslint:disable-next-line:prefer-function-over-method
  protected update()
  {
    // Nothing here, this method needs to be overriden in descendants
    // to do anything.
  }

  protected async loadingIsFinished(): Promise<void>
  {
    return new Promise<void>
    (
      (resolve, reject) => { this.finishLoading = resolve; }
    );
  }

  // ---------------- Private methods -------------------

  private startLoading()
  {
    // When the scene is started, Phaser calls preload() callback
    // which we handle by onPreload() method - the loading happens
    // there.
    // (There is no way around it, because Phaser checks if preload()
    //  even exists on scene object and if any loading is planned from
    //  it and skips loading otherwise).
    // So just imagine that 'onPreload()' is called here (which it is,
    //  indirectly).
    this.phaserScene.scene.start(this.getName());
  }

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

  // ---------------- Event handlers --------------------

  // ! Throws exception on error.
  private onPreload()
  {
    // ! Throws exception on error.
    this.loadPlugins();

    // ! Throws exception on error.
    this.loadAssets();
  }

  private onCreate()
  {
    if (this.finishLoading === "Not loading")
    {
      // This is a top-level function (it's called by Phaser engine)
      // so we report the error directly instead of throwing an exception.
      ERROR(`Unable to finish loading of ${this.debugId}`
        + ` because loading has not even started`);
      return;
    }

    // Method create() is called by the Phaser engine when loading
    // of scene assets is complete. We translate it to the end of
    // async method load() by calling its resolve function.
    this.finishLoading();
  }

  private onUpdate()
  {
    try
    {
      this.update();
    }
    catch (error)
    {
      REPORT(error, `Failed to update ${this.debugId}`);
    }
  }
}

// ------------------ Type Declarations ----------------------

export namespace Scene
{
  export const Z_ORDER_DEFAULT = 0;
}