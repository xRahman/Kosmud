/*  Part of Kosmud  */

import { Syslog } from "../../Shared/Log/Syslog";
import { Serializable } from "../../Shared/Class/Serializable";
import { ClassFactory } from "../../Shared/Class/ClassFactory";
import { FileSystem } from "../../Server/FileSystem/FileSystem";
import { Game } from "../../Server/Game/Game";
import { Zone } from "../../Server/Game/Zone";
import { Entities } from "../../Server/Class/Entities";

export class Zones extends Serializable
{
  // -------------- Static class data -------------------

  public static fileName = "zones.json";

  protected static version = 0;

  private static zoneList: Zones | "Doesn't exist" = "Doesn't exist";

  // ----------------- Private data ---------------------

  protected zones = new Set<Zone>();

  // ------------- Public static methods ----------------

  // ! Throws exception on error.
  public static async load()
  {
    if (this.zoneList !== "Doesn't exist")
      throw Error("Zone list already exists");

    // ! Throws exception on error.
    this.zoneList = await loadZoneList();

    // ! Throws exception on error.
    await this.zoneList.load();

    // ! Throws exception on error.
    this.zoneList.init();
  }

  // ! Throws exception on error.
  public static async save()
  {
    // ! Throws exception on error.
    const data = this.getZoneList().serialize("Save to file");

    // ! Throws exception on error.
    await FileSystem.writeFile(Game.dataDirectory, Zones.fileName, data);
  }

  // ! Throws exception on error.
  public static update()
  {
    // ! Throws exception on error.
    this.getZoneList().update();
  }

  public static newZone(name: string)
  {
    const zone = Entities.newRootEntity(Zone);

    zone.setName(name);
    // ! Throws exception on error.
    this.getZoneList().add(zone);
    zone.init();

    return zone;
  }

  // ! Throws exception on error.
  private static getZoneList()
  {
    if (this.zoneList === "Doesn't exist")
      throw new Error("Zone list isn't loaded yet");

    return this.zoneList;
  }

  // ---------------- Public methods --------------------

  public update()
  {
    for (const zone of this.zones)
    {
      zone.update();
    }
  }

  // ---------------- Private methods -------------------

  private add(zone: Zone)
  {
    if (this.zones.has(zone))
    {
      throw Error(`Attempt to add zone ${zone.debugId}`
        + ` which already exists in Zones`);
    }

    this.zones.add(zone);
  }

  // ! Throws exception on error.
  private async load()
  {
    for (const zone of this.zones)
    {
      // ! Throws exception on error.
      await this.loadZoneReference(zone);
    }
  }

  // ! Throws exception on error.
  private async loadZoneReference(reference: Zone)
  {
    if (!reference.isValid())
    {
      // ! Throws exception on error.
      const zone = await loadZone(reference.getId());

      this.replaceZoneReference(reference, zone);
    }
  }

  private replaceZoneReference(oldReference: Zone, newReference: Zone)
  {
    this.zones.delete(oldReference);
    this.zones.add(newReference);
  }

  private init()
  {
    for (const zone of this.zones)
    {
      // ! Throws exception on error.
      zone.init();
    }
  }
}

// ----------------- Auxiliary Functions ---------------------

async function loadZoneList()
{
  const path = FileSystem.composePath(Game.dataDirectory, Zones.fileName);
  // ! Throws exception on error.
  const readResult = await FileSystem.readFile(path);

  if (readResult === "File doesn't exist")
  {
    Syslog.log("[INFO]", `File ${path} doesn't exist, starting with no`
      + ` zones. This is ok only if you are building new data from the`
      + ` scratch, otherwise it's an error`);

    // ! Throws exception on error.
    return ClassFactory.newInstance(Zones);
  }

  // ! Throws exception on error.
  return Serializable.deserialize(readResult.data).dynamicCast(Zones);
}

// ! Throws exception on error.
async function loadZone(id: string)
{
  const directory = Zone.dataDirectory;
  // ! Throws exception on error.
  const zone = (await Entities.loadEntity(directory, id)).dynamicCast(Zone);

  return zone;
}

ClassFactory.registerClassPrototype(Zones);