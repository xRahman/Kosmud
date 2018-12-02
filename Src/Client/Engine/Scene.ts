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
import { ZeroToOne } from "../../Shared/Utils/ZeroToOne";
import { Types } from "../../Shared/Utils/Types";
import { Sprite } from "../../Client/Engine/Sprite";
import { SpriteAnimation } from "../../Client/Engine/SpriteAnimation";
import { Graphics } from "../../Client/Engine/Graphics";
import { GraphicContainer } from "../../Client/Engine/GraphicContainer";
import { Sound } from "../../Client/Engine/Sound";
import { SceneContents } from "../../Client/Engine/SceneContents";
import { Scenes } from "../../Client/Engine/Scenes";
import { Zone } from "../../Shared/Game/Zone";
import { Tilemap } from "../../Client/Engine/Tilemap";

export abstract class Scene
{
  protected contents: SceneContents | "Doesn't exist" = "Doesn't exist";
  protected phaserScene: Scene.PhaserScene;

  // protected active = false;

  private finishLoading: Types.ResolveFunction<void> | "Not loading"
    = "Not loading";

  constructor
  (
    protected name: string,
    private readonly phaserGame: Phaser.Game,
    protected width = 0,
    protected height = 0
  )
  {
    this.phaserScene = new Phaser.Scene(name);
    this.setActive(false);
    phaserGame.scene.add(name, this.phaserScene);

    this.phaserScene.preload = () => { this.onPreload(); };
    this.phaserScene.create = () => { this.onCreate(); };
    this.phaserScene.update = () => { this.onUpdate(); };

    Scenes.addScene(this);
  }

  // ---------------- Public methods --------------------

  public get debugId()
  {
    return `{ ${this.constructor.name} '${this.name}' }`;
  }

  public getName() { return this.name; }

  public isActive()
  {
    // return this.active;
    return this.phaserScene.sys.isActive();
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

  public createGraphicContainer(config: GraphicContainer.Config = {})
  {
    return new GraphicContainer(this.phaserScene, config);
  }

  public createGraphics(config: Graphics.Config)
  {
    return new Graphics(this.phaserScene, config);
  }

  public createSprite
  (
    config: Sprite.Config,
    sprite?: Phaser.GameObjects.Sprite
  )
  {
    return new Sprite(this.phaserScene, config, sprite);
  }

  public createTilemap
  (
    tilemapConfig: Zone.TilemapConfig,
    tilemapJsonData: object
  )
  {
    return new Tilemap
    (
      this.phaserScene,
      tilemapConfig,
      tilemapJsonData
    );
  }

// // ! Throws exception on error.
// public createAnimation
// (
//   animation: Sprite.Animation,
//   repeat = INFINITE_REPEAT
// )
// {
//   // ! Throws exception on error.
//   const frameNames = this.generateFrameNames(animation);

//   return this.phaserScene.anims.create
//   (
//     {
//       key: animation.name,
//       frames: frameNames,
//       frameRate: animation.frameRate,
//       repeat
//     }
//   );
// }
  // ! Throws exception on error.
  public createAnimation(animationConfig: SpriteAnimation.Config)
  {
    return new SpriteAnimation(this.phaserScene, animationConfig);
  }

  public createSound(soundId: string, baseVolume: ZeroToOne)
  {
    return new Sound(this.phaserScene, soundId, baseVolume);
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

  protected setActive(active: boolean)
  {
    this.phaserScene.sys.setActive(active);
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
    // this.getScenePlugin().start(this.getName());
    // this.phaserScene.sys.scenePlugin.start(this.getName());
    this.phaserGame.scene.start(this.getName());
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

  export interface PhaserScene extends Phaser.Scene
  {
    preload?(): void;
    create?(): void;
  }
}