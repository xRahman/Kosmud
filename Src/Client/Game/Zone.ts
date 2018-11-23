/*
  Part of Kosmud

  Part of game universe that fits into one physics world
  (all objects in the same zone can physically influence each other).
*/

// import { REPORT } from "../../Shared/Log/REPORT";
// import { JsonObject } from "../../Shared/Class/JsonObject";
// import { FileSystem } from "../../Server/FileSystem/FileSystem";
import { Ship } from "../../Client/Game/Ship";
import { Tilemap } from "../../Shared/Engine/Tilemap";
import * as Shared from "../../Shared/Game/Zone";

export class Zone extends Shared.Zone
{
  // ~ Overrides Shared.Zone.ships.
  //  (We need to override to use Client/Ship instead of Shared/Ship).
  protected readonly ships = new Set<Ship>();

  // ---------------- Public methods --------------------

  public async load()
  {
    // preloadTextures(Shared.Zone.preloadData.textures);
    // preloadAtlases(Shared.Zone.preloadData.atlases);

    await this.loadTilemaps(Shared.Zone.preloadData.tilemaps);

    this.initShapes(Shared.Zone.preloadData.shapes);
  }

  // --------------- Protected methods ------------------

  // ~ Overrides Shared.Zone.createTilemap().
  // tslint:disable-next-line:prefer-function-over-method
  protected async createTilemap(config: Shared.Zone.TilemapConfig)
  {
/// TODO: Klient bude tilemapu loadovat a vytvářet jinak.
    // Path is different on the server because server root is '/'
    // and client root is '/Client'. And we also need to make sure
    // that the part starts with './' on the sever (FileSystem
    // checks that to prevent traversing out of project directory).
    // const tilemapJsonPath = `./Client/${config.tilemapJsonPath}`;
    // const jsonData = await loadTilemapJsonData(tilemapJsonPath);

    // return new Tilemap(config.tilemapName, jsonData);
    return new Tilemap
    (
      config.tilemapName,
      /// TODO: Předávat samozřejmě něco jinýho.
      {}
    );
  }
}

// ----------------- Auxiliary Functions ---------------------