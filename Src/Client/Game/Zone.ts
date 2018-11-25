/*
  Part of Kosmud

  Part of game universe that fits into one physics world
  (all objects in the same zone can physically influence each other).
*/

import { Ship } from "../../Client/Game/Ship";
import { FlightScene } from "../../Client/FlightScene/FlightScene";
import { Tilemap } from "../../Client/Engine/Tilemap";
import * as Shared from "../../Shared/Game/Zone";

export class Zone extends Shared.Zone
{
  // ~ Overrides Shared.Zone.ships.
  //  (We need to override to use Client/Ship instead of Shared/Ship).
  protected readonly ships = new Set<Ship>();

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
    /// TODO: Vyrobit tilemapy z json dat.
    createTilemaps();
    this.initShapes(this.preloadData.shapes);

    createShips();
  }

  // --------------- Protected methods ------------------

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
    scene.preloadTilemap(config.tilemapName, config.tilemapJsonPath);
  }
}