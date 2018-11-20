/*
  Part of Kosmud

  Part of game universe that fits into one physics world
  (all objects in the same zone can physically influence each other).
*/

import { JsonObject } from "../../Shared/Class/JsonObject";
import { FileSystem } from "../../Server/FileSystem/FileSystem";
import { Ship } from "../../Server/Game/Ship";
import { Tilemap } from "../../Shared/Engine/Tilemap";
import * as Shared from "../../Shared/Game/Zone";

export class Zone extends Shared.Zone
{
  // ---------------- Public methods --------------------

  /// TEST
  public fakeLoad()
  {
    const fighter = new Ship();
    /// TODO: Nasetovat properties, které se časem budou setovat
    /// editorem a loadovat.
    fighter.setShapeId(Zone.FIGHTER_SHAPE_ID);
    this.addShip(fighter);
  }

  public async preload()
  {
    /// Tohle je blbost, na serveru textury nepotřebuju ;-)
    // preloadTextures(Shared.Zone.preloadData.textures);
    // preloadAtlases(Shared.Zone.preloadData.atlases);

    await this.preloadTilemaps(Shared.Zone.preloadData.tilemaps);

    this.initShapes(Shared.Zone.preloadData.shapes);
  }

  // --------------- Protected methods ------------------

  // ~ Overrides Shared.Zone.createTilemap().
  // tslint:disable-next-line:prefer-function-over-method
  protected async createTilemap(config: Shared.Zone.TilemapConfig)
  {
    const jsonData = await loadTilemapJsonData(config.tilemapJsonPath);

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