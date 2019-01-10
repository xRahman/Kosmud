/*
  Part of Kosmud

  Part of game world that fits into one physics world
  (all objects in the same zone can physically influence each other).
*/

import { ClassFactory } from "../../Shared/Class/ClassFactory";
// import { JsonObject } from "../../Shared/Class/JsonObject";
import { FileSystem } from "../../Server/FileSystem/FileSystem";
import { Entities } from "../../Server/Class/Entities";
// import { Asset } from "../../Shared/Asset/Asset";
// import { Assets } from "../../Server/Asset/Assets";
import { Ship } from "../../Server/Game/Ship";
// import { Tilemap } from "../../Shared/Engine/Tilemap";
import { ZoneUpdate } from "../../Shared/Protocol/ZoneUpdate";
import * as Shared from "../../Shared/Game/Zone";

export class Zone extends Shared.Zone
{
  public static dataDirectory = "./Data/Zones/";

  protected static version = 0;

  // ~ Overrides Shared.Zone.ships.
  //  (We need to override to use Server/Ship instead of Shared/Ship).
  protected readonly ships = new Set<Ship>();

  // ---------------- Public methods --------------------

  // // ! Throws exception on error.
  // public async loadAssets()
  // {
  //   const listOfAssets = this.compileListOfAssets();

  //   // Use asset entity id's stored in invalid references to load
  //   // respective entities.
  //   for (const asset of listOfAssets)
  //   {
  //     // If the reference is valid, it means the asset is already loaded.
  //     if (!asset.isValid())
  //     {
  //       await Assets.loadAsset(asset.getId());
  //     }
  //   }
  // }

  // public async loadAssets()
  // {
  //   await this.loadTilemaps();
  // }

  // ! Throws exception on error.
  public async save()
  {
    // ! Throws exception on error.
    const fileName = `${this.getId()}.json`;
    // ! Throws exception on error.
    const data = this.serialize("Save to file");

    // ! Throws exception on error.
    await FileSystem.writeFile(Zone.dataDirectory, fileName, data);
  }

  public getUpdate()
  {
    const shipStates: Array<ZoneUpdate.ShipState> = [];

    for (const ship of this.ships.values())
    {
      shipStates.push(ship.getStateUpdate());
    }

    /// TODO: Původně to mělo jako parametr 'shipStates'.
    return ClassFactory.newInstance(ZoneUpdate);
  }

  // // ~ Overrides Shared.Zone.init().
  // // Called after zone is loaded or created.
  // public init()
  // {
  //   super.init();

  //   this.initShapes();
  // }

  // ---------------- Private methods -------------------

  // // ! Throws exception on error.
  // private async loadTilemaps()
  // {
  //   /// Prozatím prolezu ships - to jsou jediné entity v zóně,
  //   /// které mají physics shape. Časem jich bude víc.
  //   ///   TODO: Rozšířit to pro missiles, objekty v zóně a podobně
  //   /// (nejspíš to místo do .ships házet do .physicsObjects, nebo
  //   ///  tak něco).
  //   for (const ship of this.ships)
  //   {
  //     ship.loadTilemap();
  //   }

  //   // for (const tilemapConfig of this.assets.tilemaps)
  //   // {
  //   //   // ! Throws exception on error.
  //   //   const tilemap = await createTilemap(tilemapConfig);

  //   //   this.addTilemap(tilemap);
  //   // }
  // }
}

// ----------------- Auxiliary Functions ---------------------

// async function createTilemap(config: Shared.Zone.TilemapConfig)
// {
//   // Path is different on the server because server root is '/'
//   // and client root is '/Client'. And we also need to make sure
//   // that the part starts with './' on the sever (FileSystem
//   // checks that to prevent traversing out of project directory).
//   const tilemapJsonPath = `./Client/${config.tilemapJsonPath}`;
//   const jsonData = await loadTilemapJsonData(tilemapJsonPath);

//   // ! Throws exception on error.
//   return new Tilemap(config.tilemapId, jsonData);
// }

// async function loadTilemapJsonData(jsonFilePath: string)
// {
//   // ! Throws exception on error.
//   const jsonData = await FileSystem.readExistingFile(jsonFilePath);

//   // ! Throws exception on error.
//   return JsonObject.parse(jsonData);
// }

Entities.createRootPrototypeEntity(Zone);