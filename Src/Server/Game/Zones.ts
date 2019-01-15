/*  Part of Kosmud  */

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

  // ~ Override Shared.Zones.zones so we can work
  //   with server-side version of Zone.
  protected zones = new Set<Zone>();

  // ------------- Public static methods ----------------

  // ! Throws exception on error.
  public static async load()
  {
    // ! Throws exception on error.
    const zones = await loadListOfZones();

    await zones.loadZones();

    return zones;
  }

  // ---------------- Public methods --------------------

  public newZone(name: string)
  {
    const zone = Entities.newRootEntity(Zone);

    zone.setName(name);
    this.add(zone);
    zone.init();

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
  private async loadZones()
  {
    // Entities listed in this.zones hasn't been loaded yet,
    // the list contains only "invalid entity references".
    //   So we iterate through these invalid references, load
    // each zone using id stored in the reference and replace
    // the invalid reference with a newly loaded zone.
    for (const zone of this.zones)
    {
      if (!zone.isValid())
      {
        // ! Throws exception on error.
        const loadedZone = await loadZone(zone.getId());

        this.replaceZoneReference(zone, loadedZone);
      }
    }
  }

  // // ! Throws exception on error.
  // private async loadAssets()
  // {
  //   for (const zone of this.zones)
  //   {
  //     // ! Throws exception on error.
  //     await zone.loadAssets();
  //   }
  // }

  private replaceZoneReference(oldReference: Zone, newReference: Zone)
  {
    this.zones.delete(oldReference);
    this.zones.add(newReference);
  }
}

// ----------------- Auxiliary Functions ---------------------

async function loadListOfZones()
{
  const path = FileSystem.composePath(Zones.dataDirectory, Zones.fileName);

  // ! Throws exception on error.
  const readResult = await FileSystem.readFile(path);

  if (readResult === "File doesn't exist")
    // ! Throws exception on error.
    return ClassFactory.newInstance(Zones);

  // ! Throws exception on error.
  return Serializable.deserialize(readResult.data).dynamicCast(Zones);
}

// ! Throws exception on error.
async function loadZone(id: string)
{
  const directory = Zone.dataDirectory;
  // ! Throws exception on error.
  const zone = (await Entities.loadEntity(directory, id)).dynamicCast(Zone);

  zone.init();

  return zone;
}

ClassFactory.registerClassPrototype(Zones);