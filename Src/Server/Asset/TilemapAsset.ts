/*  Part of Kosmud  */

import { Attributes } from "../../Shared/Class/Attributes";
import { JsonObject } from "../../Shared/Class/JsonObject";
import { FileSystem } from "../../Server/FileSystem/FileSystem";
import { Entities } from "../../Server/Class/Entities";
import { Tilemap } from "../../Shared/Engine/Tilemap";
import { TilemapDescriptor } from "../../Shared/Asset/TilemapDescriptor";
import { Asset } from "../../Server/Asset/Asset";

export class TilemapAsset extends Asset
{
  public readonly descriptor = new TilemapDescriptor();

  protected static version = 0;

  private tilemap: Tilemap | "Not set" = "Not set";
  private static readonly tilemap: Attributes =
  {
    saved: false,
    sentToClient: false
  };

  // ---------------- Public methods --------------------

  // ~ Overrides ServerAsset.load().
  public async load()
  {
    const tilemapJsonPath = `./Client/${this.descriptor.path}`;

    // ! Throws exception on error.
    const jsonData = await loadTilemapJsonData(tilemapJsonPath);
    const tilemap = new Tilemap(this.getId(), jsonData);

    // ! Throws exception on error.
    this.setTilemap(tilemap);
  }

  // ~ Overrides ServerAsset.init().
  public init()
  {
    // Nothing here (tilemap doesn't need init on the server).
  }

  public setTilemap(tilemap: Tilemap)
  {
    if (this.tilemap !== "Not set")
    {
      throw Error(`Tilemap is already set to ${this.debugId}`);
    }

    this.tilemap = tilemap;
  }

  public getTilemap()
  {
    if (this.tilemap === "Not set")
    {
      throw Error(`Tilemap asset ${this.debugId} doesn't`
        + ` have a tilemap data loaded yet`);
    }

    return this.tilemap;
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