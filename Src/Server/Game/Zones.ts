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
    const path = FileSystem.composePath(Zones.dataDirectory, Zones.fileName);

    const readResult = await FileSystem.readFile(path);

    if (readResult === "File doesn't exist")
      return ClassFactory.newInstance(Zones);

    const zones = await loadZoneListFromJson(readResult.data);

    await zones.load();

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
    // Since entities listed in this.zones hadn't been loaded
    // yet at the time of loading of the list of zones, is
    // had been populated with "invalid entity references"
    // instead. Such reference only has an entity id in the,
    // other properties are undefined.
    //   So in order to load zone entities, we iterate through
    // this list, load each zone using id stored in respective
    // invalid entity reference and replace the invalid reference
    // with a newly loaded zone entity.
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

  // ! Throws exception on error.
  private async loadAssets()
  {
    for (const zone of this.zones)
    {
      // ! Throws exception on error.
      await zone.loadAssets();
    }
  }

  private replaceZoneReference(oldReference: Zone, newReference: Zone)
  {
    this.zones.delete(oldReference);
    this.zones.add(newReference);
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
  const directory = Zone.dataDirectory;
  // ! Throws exception on error.
  const zone = (await Entities.loadEntity(directory, id)).dynamicCast(Zone);

  // Definitions of assets used in zone are not listed in zone
  // entities because they are shared among different zones.
  // It means that we need to load them separately.
  await zone.loadAssets();

  await zone.loadAssets();

  zone.init();

  return zone;
}

ClassFactory.registerClassPrototype(Zones);