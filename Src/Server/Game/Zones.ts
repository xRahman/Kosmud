/*
  Part of Kosmud

  Zones and more zones.
*/

import { Serializable } from "../../Shared/Class/Serializable";
import { ClassFactory } from "../../Shared/Class/ClassFactory";
import { FileSystem } from "../../Server/FileSystem/FileSystem";
import { Zone } from "../../Server/Game/Zone";
import { Entities } from "../../Server/Class/Entities";
import * as Shared from "../../Shared/Game/Zones";

export class Zones extends Shared.Zones
{
  public static dataDirectory = "./Data/";
  public static fileName = "zones.json";

  protected static version = 0;

  // ~ Override Shared.Zones.zones becuase we need to work
  //   with server-side version of Zone.
  protected zones = new Set<Zone>();

  // ------------- Public static methods ----------------

  // ! Throws exception on error.
  public static async load()
  {
    const path = FileSystem.composePath(Zones.dataDirectory, Zones.fileName);

    const readResult = await FileSystem.readFile(path);

    if (readResult === "File doesn't exist")
      return ClassFactory.instantiateClass(Zones);

    const zones = await loadZoneListFromJson(readResult.data);

    await zones.load();

    return zones;
  }

  // ---------------- Public methods --------------------

  public newZone()
  {
    const className = Zone.name;
    const zone = Entities.newEntity(className).dynamicCast(Zone);

    this.add(zone);

    return zone;
  }

  public update()
  {
    for (const zone of this.zones)
    {
      zone.update();
    }
  }

  public async save()
  {
    // ! Throws exception on error.
    const data = this.serialize("Save to file");

    // ! Throws exception on error.
    await FileSystem.writeFile(Zones.dataDirectory, Zones.fileName, data);
  }

  // ---------------- Private methods -------------------

  // ! Throws exception on error.
  private async load()
  {
    // ! Throws exception on error.
    await this.loadZones();
    // ! Throws exception on error.
    await this.loadAssets();
  }

  // ! Throws exception on error.
  private async loadZones()
  {
    for (const zone of this.zones)
    {
      if (zone.isValid() === false)
      {
        // ! Throws exception on error.
        const loadedZone = await loadZone(zone.getId());

        this.zones.delete(zone);
        this.zones.add(loadedZone);
      }
    }
  }

  // ! Throws exception on error.
  private async loadAssets()
  {
    for (const zone of this.zones)
    {
      // ! Throws exception on error.
      await zone.loadAssets();
    }
  }
}

// ----------------- Auxiliary Functions ---------------------

async function loadZoneListFromJson(json: string)
{
  // ! Throws exception on error.
  return Serializable.deserialize(json).dynamicCast(Zones);
}

// ! Throws exception on error.
async function loadZone(id: string)
{
  // ! Throws exception on error.
  const zone = await Entities.loadEntity(Zone.dataDirectory, id);

  // ! Throws exception on error.
  return zone.dynamicCast(Zone);
}

ClassFactory.registerClassPrototype(Zones);