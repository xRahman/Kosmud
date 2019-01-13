/*  Part of Kosmud  */

import { JsonObject } from "../../Shared/Class/JsonObject";
import { FileSystem } from "../../Server/FileSystem/FileSystem";
import { Entities } from "../../Server/Class/Entities";
import { Tilemap } from "../../Shared/Engine/Tilemap";
import { ServerAsset } from "../../Server/Asset/ServerAsset";
import * as Shared from "../../Shared/Asset/TilemapAsset";

export class TilemapAsset extends Shared.TilemapAsset implements ServerAsset
{
  protected static version = 0;

  // ---------------- Public methods --------------------

  public async load()
  {
    const tilemapJsonPath = `./Client/${this.path}`;

    // ! Throws exception on error.
    const jsonData = await loadTilemapJsonData(tilemapJsonPath);
    const tilemap = new Tilemap(this.getId(), jsonData);

    // ! Throws exception on error.
    this.setTilemap(tilemap);
  }
}

// ----------------- Auxiliary Functions ---------------------

// ! Throws exception on error.
async function loadTilemapJsonData(jsonFilePath: string)
{
  // ! Throws exception on error.
  const jsonData = await FileSystem.readExistingFile(jsonFilePath);

  // ! Throws exception on error.
  return JsonObject.parse(jsonData);
}

Entities.createRootPrototypeEntity(TilemapAsset);