/*
  Part of Kosmud

  Part of game universe that fits into one physics world
  (all objects in the same zone can physically influence each other).
*/

import { Ship } from "../../Client/Game/Ship";
import { FlightScene } from "../../Client/FlightScene/FlightScene";
import { Tilemap } from "../../Client/Engine/Tilemap";
import { SceneUpdate } from "../../Shared/Protocol/SceneUpdate";
import * as Shared from "../../Shared/Game/Zone";

export class Zone extends Shared.Zone
{
  // ~ Overrides Shared.Zone.ships.
  //  (We need to override to use Client/Ship instead of Shared/Ship).
  protected readonly ships = new Map<string, Ship>();

  private scene: FlightScene | "Not assigned" = "Not assigned";

  // ---------------- Public methods --------------------

  public preload(scene: FlightScene)
  {
    preloadTextures(scene, this.preloadData.textures);
    preloadAtlases(scene, this.preloadData.atlases);
    preloadSounds(scene, this.preloadData.sounds);

    preloadTilemaps(scene, this.preloadData.tilemaps);
  }

  public create(scene: FlightScene)
  {
    this.scene = scene;

    this.createTilemaps(scene);
    this.initShapes();

    /// V tenhle moment ještě nemůžou bejt v zóně lodě,
    /// protože přidat je lze až poté, co jsou vyrobené
    /// tilemapy a initnuté shapy.
    // this.createShips(scene);
  }

  // ~ Overrides Shared.Zone.addShip().
  // ! Throws exception on error.
  public addShip(ship: Ship)
  {
    super.addShip(ship);

    ship.createModel(this.getScene(), this);
  }

  // ! Throws exception on error.
  // ~ Overrides Shared.Zone.getTilemap().
  //   (Override is needed to return client version of Tilemap.)
  public getTilemap(name: string)
  {
    return super.getTilemap(name) as Tilemap;
  }

  public updateShips(shipStates: Array<SceneUpdate.ShipState>)
  {
    for (const shipState of shipStates)
    {
      const ship = this.getShip(shipState.shipId);

      if (ship === "Not found")
      {
        throw new Error(`Failed to update ship because ship`
          + ` with id ${shipState.shipId} isn't present in`
          + ` zone ${this.debugId}`);
      }

      ship.update(shipState);
    }
  }

  // --------------- Protected methods ------------------

  // ~ Overrides Shared.Zone.getShip().
  //   (We override ancestor version to return client version of ship.)
  protected getShip(id: string): Ship | "Not found"
  {
    const ship = this.ships.get(id);

    if (ship === undefined)
      return "Not found";

    return ship;
  }

  // ~ Overrides Shared.Zone.createTilemap().
  // tslint:disable-next-line:prefer-function-over-method
//   protected async createTilemap(config: Shared.Zone.TilemapConfig)
//   {
// /// TODO: Klient bude tilemapu loadovat a vytvářet jinak.
//     // Path is different on the server because server root is '/'
//     // and client root is '/Client'. And we also need to make sure
//     // that the part starts with './' on the sever (FileSystem
//     // checks that to prevent traversing out of project directory).
//     // const tilemapJsonPath = `./Client/${config.tilemapJsonPath}`;
//     // const jsonData = await loadTilemapJsonData(tilemapJsonPath);

//     // return new Tilemap(config.tilemapName, jsonData);
//     return new Tilemap
//     (
//       config.tilemapName,
//       /// TODO: Předávat samozřejmě něco jinýho.
//       {}
//     );
//   }

  // ---------------- Private methods -------------------

  private createTilemaps(scene: FlightScene)
  {
    for (const config of this.preloadData.tilemaps)
    {
      const tilemapJsonData = scene.getTilemapJsonData(config.tilemapId);

      this.addTilemap(new Tilemap(scene, config, tilemapJsonData));
    }
  }

  // ! Throws exception on error.
  private getScene()
  {
    if (this.scene === "Not assigned")
    {
      throw new Error(`Scene is not assigned to zone ${this.debugId}`
        + ` yet. Make sure you call create() on the zone before you`
        + ` use the scene`);
    }

    return this.scene;
  }

  /// V create() ještě v zóně nejsou žádný lodě, takže tohle
  /// nejspíš nebude potřeba.
  // private createShips(scene: FlightScene)
  // {
  //   for (const ship of this.ships)
  //   {
  //     ship.create(scene, this);
  //   }
  // }
}

// ----------------- Auxiliary Functions ---------------------

function preloadTextures
(
  scene: FlightScene,
  configs: Array<Shared.Zone.TextureConfig>
)
{
  for (const config of configs)
  {
    scene.preloadTexture(config.textureId, config.texturePath);
  }
}

function preloadAtlases
(
  scene: FlightScene,
  configs: Array<Shared.Zone.TextureAtlasConfig>
)
{
  for (const config of configs)
  {
    scene.preloadTextureAtlas
    (
      config.atlasId,
      config.atlasJsonPath,
      config.textureDirectory
    );
  }
}

function preloadSounds
(
  scene: FlightScene,
  configs: Array<Shared.Zone.SoundConfig>
)
{
  for (const config of configs)
  {
    scene.preloadSound(config.soundId, config.soundPath);
  }
}

function preloadTilemaps
(
  scene: FlightScene,
  configs: Array<Shared.Zone.TilemapConfig>
)
{
  for (const config of configs)
  {
    scene.preloadTilemap(config.tilemapId, config.tilemapJsonPath);
  }
}