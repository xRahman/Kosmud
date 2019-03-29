/*
  Part of Kosmud

  Wraps Scene.PhaserScene
*/

import { ERROR } from "../../Shared/Log/ERROR";
import { REPORT } from "../../Shared/Log/REPORT";
import { ZeroToOne } from "../../Shared/Utils/ZeroToOne";
import { Types } from "../../Shared/Utils/Types";
import { Sprite } from "../../Client/Engine/Sprite";
import { SpriteAnimation } from "../../Client/Engine/SpriteAnimation";
import { Graphics } from "../../Client/Engine/Graphics";
import { GraphicContainer } from "../../Client/Engine/GraphicContainer";
import { Mouse } from "../../Client/Engine/Mouse";
import { Keyboard } from "../../Client/Engine/Keyboard";
import { Sound } from "../../Client/Engine/Sound";
import { SceneInput } from "../../Client/Engine/SceneInput";
import { Scenes } from "../../Client/Engine/Scenes";
import { Tilemap } from "../../Client/Engine/Tilemap";
import { ClientAsset } from "../../Client/Asset/ClientAsset";
import { TilemapAsset } from "../../Client/Asset/TilemapAsset";
import { ShapeAsset } from "../../Client/Asset/ShapeAsset";
import { SoundAsset } from "../../Client/Asset/SoundAsset";

export abstract class Scene
{
  protected phaserScene: Scene.PhaserScene;

  protected input: SceneInput | "Doesn't exist" = "Doesn't exist";

  private finishLoading: Types.ResolveFunction<void> | "Not loading"
    = "Not loading";

  private assets: Set<ClientAsset> | "Not set" = "Not set";

  private readonly tilemapAssets = new Set<TilemapAsset>();
  private readonly shapeAssets = new Set<ShapeAsset>();

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

  public setAssets(assets: Set<ClientAsset>)
  {
    this.assets = assets;
  }

  // ! Throws exception on error.
  public getAssets()
  {
    if (this.assets === "Not set")
    {
      throw Error(`Assets are not se to the scene`);
    }

    return this.assets;
  }

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

    this.updateCamera();
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

  public loadTilemap(tilemapAsset: TilemapAsset)
  {
    const tilemapDataId = tilemapAsset.getId();
    const tilemapJsonFilePath = tilemapAsset.descriptor.path;

    this.phaserScene.load.tilemapTiledJSON(tilemapDataId, tilemapJsonFilePath);

    // Add reference to 'tilemapAsset' so we can init it's tilemap
    // reference after loading finishes.
    this.addTilemapAsset(tilemapAsset);
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
    tilemapAsset: TilemapAsset,
    tilemapJsonData: object
  )
  {
    return new Tilemap
    (
      this.phaserScene,
      tilemapAsset,
      tilemapJsonData
    );
  }

  // ! Throws exception on error.
  public createAnimation(animationConfig: SpriteAnimation.Config)
  {
    return new SpriteAnimation(this.phaserScene, animationConfig);
  }

  public createSound(soundAsset: SoundAsset, baseVolume: ZeroToOne)
  {
    return new Sound(this.phaserScene, soundAsset.getId(), baseVolume);
  }

  public createKeyboard()
  {
    return new Keyboard(this.phaserScene.input);
  }

  public createMouse()
  {
    return new Mouse(this.phaserScene);
  }

  public init()
  {
    this.initTilemaps();
    this.initShapes();
  }

  public addShapeAsset(shapeAsset: ShapeAsset)
  {
    if (this.shapeAssets.has(shapeAsset))
    {
      throw Error(`${this.debugId} already has ${shapeAsset} in`
        + ` the list of shape assets`);
    }
  }

  // --------------- Protected methods ------------------

  // ! Throws exception on error.
  // tslint:disable-next-line
  protected loadPlugins() {}

  // ! Throws exception on error.
  protected loadAssets()
  {
    if (this.assets === "Not set")
    {
      throw Error(`${this.debugId} doesn't have a list of assets.`
        + ` It needs to be set prior to loading the scene`);
    }

    for (const asset of this.assets)
    {
      asset.load(this);
    }
  }

  protected setActive(active: boolean)
  {
    this.phaserScene.sys.setActive(active);
  }

  // ! Throws exception on error.
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

  protected updateCamera()
  {
    this.phaserScene.cameras.main.scrollX = -this.width / 2;
    this.phaserScene.cameras.main.scrollY = -this.height / 2;
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

  private addTilemapAsset(tilemapAsset: TilemapAsset)
  {
    if (this.tilemapAssets.has(tilemapAsset))
    {
      throw Error(`${this.debugId} already has ${tilemapAsset} in`
        + ` the list of tilemap assets`);
    }
  }

  // ! Throws exception on error.
  private getTilemapJsonData(tilemapId: string)
  {
    // Phaser loads tilemap json data so we don't have to do it again.
    const jsonData = this.phaserScene.cache.tilemap.get(tilemapId).data;

    if (!jsonData || typeof jsonData !== "object")
    {
      throw Error(`Failed to find tilemap json data for tilemap`
        + ` id '${tilemapId}'. Make sure that tilemap with this id`
        + ` is loaded`);
    }

    return jsonData as object;
  }

  private initTilemaps()
  {
    for (const tilemapAsset of this.tilemapAssets)
    {
      // ! Throws exception on error.
      const tilemapJsonData = this.getTilemapJsonData(tilemapAsset.getId());
      const tilemap = this.createTilemap(tilemapAsset, tilemapJsonData);

      tilemapAsset.setTilemap(tilemap);
    }
  }

  private initShapes()
  {
    for (const shapeAsset of this.shapeAssets)
    {
      const tilemap = shapeAsset.getTilemapAsset().getTilemap();

      // ! Throws exception on error.
      const shape = tilemap.getShape
      (
        shapeAsset.descriptor.objectLayerName,
        shapeAsset.descriptor.objectName
      );

      shapeAsset.setShape(shape);
    }
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