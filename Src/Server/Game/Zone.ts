/*
  Part of Kosmud

  Part of game universe that fits into one physics world
  (all objects in the same zone can physically influence each other).
*/

import { REPORT } from "../../Shared/Log/REPORT";
import { JsonObject } from "../../Shared/Class/JsonObject";
import { FileSystem } from "../../Server/FileSystem/FileSystem";
// import { Connection } from "../../Server/Net/Connection";
import { Ship } from "../../Server/Game/Ship";
import { Tilemap } from "../../Shared/Engine/Tilemap";
import { SceneUpdate } from "../../Shared/Protocol/SceneUpdate";
// import { ShipToScene } from "../../Shared/Protocol/ShipToScene";
import * as Shared from "../../Shared/Game/Zone";

export class Zone extends Shared.Zone
{
  // ~ Overrides Shared.Zone.ships.
  //  (We need to override to use Server/Ship instead of Client/Ship).
  protected readonly ships = new Set<Ship>();

  // ---------------- Public methods --------------------

  public async load()
  {
    /// Tohle je blbost, na serveru textury nepotřebuju ;-)
    // preloadTextures(Shared.Zone.preloadData.textures);
    // preloadAtlases(Shared.Zone.preloadData.atlases);

    await this.loadTilemaps(Shared.Zone.preloadData.tilemaps);

    this.initShapes(Shared.Zone.preloadData.shapes);
  }

  public steerVehicles()
  {
    for (const ship of this.ships)
    {
      steerShip(ship);
    }
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

  // public sendShipsToClient(connection: Connection)
  // {
  //   for (const ship of this.ships)
  //   {
  //     const shipState = ship.getInitialState();

  //     const packet = new ShipToScene
  //     (
  //       shipState.shape,
  //       shipState.position,
  //       shipState.rotation
  //     );

  //     connection.send(packet);
  //   }
  // }

  // --------------- Protected methods ------------------

  // ~ Overrides Shared.Zone.createTilemap().
  // tslint:disable-next-line:prefer-function-over-method
  protected async createTilemap(config: Shared.Zone.TilemapConfig)
  {
    // Path is different on the server because server root is '/'
    // and client root is '/Client'. And we also need to make sure
    // that the part starts with './' on the sever (FileSystem
    // checks that to prevent traversing out of project directory).
    const tilemapJsonPath = `./Client/${config.tilemapJsonPath}`;
    const jsonData = await loadTilemapJsonData(tilemapJsonPath);

    return new Tilemap(config.tilemapName, jsonData);
  }
}

// ----------------- Auxiliary Functions ---------------------

async function loadTilemapJsonData(jsonFilePath: string)
{
  // ! Throws exception on error.
  const jsonData = await FileSystem.readExistingFile(jsonFilePath);

  // ! Throws exception on error.
  return JsonObject.parse(jsonData);
}

function steerShip(ship: Ship)
{
  try
  {
    ship.steer();
  }
  catch (error)
  {
    REPORT(error, `Failed to steer ship ${ship.debugId}`);
  }
}