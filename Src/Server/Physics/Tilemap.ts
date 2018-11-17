/*
  Server implementation of Tilemap.
*/

import { JsonObject } from "../../Shared/Class/JsonObject";
import { FileSystem } from "../../Server/FileSystem/FileSystem";
import * as Shared from "../../Shared/Physics/Tilemap";

export class Tilemap extends Shared.Tilemap
{
  private data: Shared.Tilemap.Data | "Not loaded" = "Not loaded";

  constructor(jsonFilePath: string)
  {
    super();
  }

  // ---------------- Public methods --------------------

  // ! Throws exception on error.
  public async load(jsonFilePath: string)
  {
    // ! Throws exception on error.
    const jsonData = await FileSystem.readExistingFile(jsonFilePath);

    // ! Throws exception on error.
    this.data = (JsonObject.parse(jsonData) as Shared.Tilemap.Data);
  }

  // ---------------- Private methods -------------------
}