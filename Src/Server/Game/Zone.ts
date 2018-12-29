/*
  Part of Kosmud

  Part of game universe that fits into one physics world
  (all objects in the same zone can physically influence each other).
*/

import { Serializable } from "../../Shared/Class/Serializable";
import { CONTENTS, ContainerEntity } from "../../Shared/Class/ContainerEntity";
import { JsonObject } from "../../Shared/Class/JsonObject";
import { FileSystem } from "../../Server/FileSystem/FileSystem";
import { Entities } from "../../Server/Class/Entities";
import { Ship } from "../../Server/Game/Ship";
import { Tilemap } from "../../Shared/Engine/Tilemap";
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

  // ! Throws exception on error.
  public async loadAssets()
  {
    // ! Throws exception on error.
    await this.loadTilemaps();

    // ! Throws exception on error.
    this.initShapes();
  }

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

    return new ZoneUpdate(shipStates);
  }

  // -------------- Protected methods -------------------

  // ~ Overrides Serializable.customSerializeProperty.
  protected customSerializeProperty(param: Serializable.SerializeParam): any
  {
    if (param.mode !== "Save to file")
      return "Property isn't serialized customly";

    if (param.property === this.getContents())
      return this.serializeContents(param.property, "Save to file");

    return "Property isn't serialized customly";
  }

  // ~ Overrides Serializable.customDeserializeProperty.
  protected customDeserializeProperty(param: Serializable.DeserializeParam)
  {
    if (param.propertyName === CONTENTS)
      return this.deserializeContents(param.sourceProperty);

    return "Property isn't deserialized customly";
  }

  // ---------------- Private methods -------------------

  // ! Throws exception on error.
  private async loadTilemaps()
  {
    for (const tilemapConfig of this.assets.tilemaps)
    {
      // ! Throws exception on error.
      const tilemap = await createTilemap(tilemapConfig);

      this.addTilemap(tilemap);
    }
  }

  private serializeContents
  (
    contents: Set<ContainerEntity>,
    mode: Serializable.Mode
  )
  {
    const serializedContents = new Array<object>();

    // Unlike other entities, zone saves all of it's containing
    // entities into the same json.
    for (const entity of contents)
      serializedContents.push(entity.saveToJsonObject(mode));

    const result =
    {
      className: "EntityContents",
      version: 0,
      contents: serializedContents
    };

    return result;
  }

  private deserializeContents(sourceProperty: object)
  {
    const contents = new Set();
    const serializedContents =
      (sourceProperty as any)[CONTENTS] as Array<object>;

    for (const serializedEntity of serializedContents)
    {
      const entity = Entities.loadEntityFromJsonObject(serializedEntity);

      contents.add(entity);
    }

    return contents;
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

  // ! Throws exception on error.
  return new Tilemap(config.tilemapId, jsonData);
}

async function loadTilemapJsonData(jsonFilePath: string)
{
  // ! Throws exception on error.
  const jsonData = await FileSystem.readExistingFile(jsonFilePath);

  // ! Throws exception on error.
  return JsonObject.parse(jsonData);
}

Entities.createRootPrototypeEntity(Zone);