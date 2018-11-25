/*
  Part of Kosmud

  Part of game universe that fits into one physics world
  (all objects in the same zone can physically influence each other).
*/

import { JsonObject } from "../../Shared/Class/JsonObject";
import { FileSystem } from "../../Server/FileSystem/FileSystem";
import { Ship } from "../../Server/Game/Ship";
import { Tilemap } from "../../Shared/Engine/Tilemap";
import { SceneUpdate } from "../../Shared/Protocol/SceneUpdate";
import * as Shared from "../../Shared/Game/Zone";

export class Zone extends Shared.Zone
{
  // ~ Overrides Shared.Zone.ships.
  //  (We need to override to use Server/Ship instead of Shared/Ship).
  protected readonly ships = new Set<Ship>();

  // ---------------- Public methods --------------------

  public async load()
  {
    await this.loadTilemaps(this.preloadData.tilemaps);

    this.initShapes(this.preloadData.shapes);
  }

  public getSceneUpdate()
  {
    const shipStates: Array<SceneUpdate.ShipState> = [];

    for (const ship of this.ships)
    {
      shipStates.push(ship.getStateUpdate());
    }

    return new SceneUpdate(shipStates);
  }

  // ---------------- Private methods -------------------

  private async loadTilemaps(configs: Array<Shared.Zone.TilemapConfig>)
  {
    for (const config of configs)
    {
      const tilemap = await createTilemap(config);

      this.addTilemap(tilemap);
    }
  }
}

// ----------------- Auxiliary Functions ---------------------

// ~ Overrides Shared.Zone.createTilemap().
async function createTilemap(config: Shared.Zone.TilemapConfig)
{
  // Path is different on the server because server root is '/'
  // and client root is '/Client'. And we also need to make sure
  // that the part starts with './' on the sever (FileSystem
  // checks that to prevent traversing out of project directory).
  const tilemapJsonPath = `./Client/${config.tilemapJsonPath}`;
  const jsonData = await loadTilemapJsonData(tilemapJsonPath);

  return new Tilemap(config.tilemapName, jsonData);
}

async function loadTilemapJsonData(jsonFilePath: string)
{
  // ! Throws exception on error.
  const jsonData = await FileSystem.readExistingFile(jsonFilePath);

  // ! Throws exception on error.
  return JsonObject.parse(jsonData);
}