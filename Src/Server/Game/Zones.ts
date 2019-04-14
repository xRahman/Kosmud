/*  Part of Kosmud  */

import { Syslog } from "../../Shared/Log/Syslog";
import { Serializable } from "../../Shared/Class/Serializable";
import { ClassFactory } from "../../Shared/Class/ClassFactory";
import { FileSystem } from "../../Server/FileSystem/FileSystem";
import { Game } from "../../Server/Game/Game";
import { Zone } from "../../Server/Game/Zone";
import { Entities } from "../../Server/Class/Entities";

const ZONES_FILE_NAME = "zones.json";

let instance: Zones | undefined;

// ------------------------ Class ----------------------------

// Zones are saved using an instance of serializable class.
export class Zones extends Serializable
{
  protected static version = 0;

  // ----------------- Private data ---------------------

  private readonly zones = new Set<Zone>();

  // ---------------- Public methods --------------------

  // ! Throws exception on error.
  public async load()
  {
    for (const zone of this.zones)
    {
      // ! Throws exception on error.
      await this.loadZoneReference(zone);
    }
  }

  // ! Throws exception on error.
  public init()
  {
    for (const zone of this.zones)
    {
      // ! Throws exception on error.
      zone.init();
    }
  }

  // ! Throws exception on error.
  public addZone(zone: Zone)
  {
    if (this.zones.has(zone))
    {
      throw Error(`Attempt to add zone ${zone.debugId}`
        + ` which already exists in Zones`);
    }

    this.zones.add(zone);
  }

  public steerVehicles()
  {
    for (const zone of this.zones)
    {
      zone.steerVehicles();
    }
  }

  // ! Throws exception on error.
  public updatePositionsAndRotations()
  {
    // ! Throws exception on error.
    for (const zone of this.zones)
    {
      zone.updatePositionsAndRotations();
    }
  }

  // ---------------- Private methods -------------------

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
}

ClassFactory.registerClassPrototype(Zones);

// ---------------------- Namespace --------------------------

export namespace Zones
{
  // ! Throws exception on error.
  export async function load()
  {
    if (instance)
      throw Error("Instance of Zones already exists");

    // ! Throws exception on error.
    instance = await loadZoneList();

    // ! Throws exception on error.
    await instance.load();

    // ! Throws exception on error.
    instance.init();
  }

  // ! Throws exception on error.
  export async function save()
  {
    // ! Throws exception on error.
    const data = getInstance().serialize("Save to file");

    // ! Throws exception on error.
    await FileSystem.writeFile(Game.dataDirectory, ZONES_FILE_NAME, data);
  }

  // ! Throws exception on error.
  export function steerVehicles()
  {
    // ! Throws exception on error.
    getInstance().steerVehicles();
  }

  // ! Throws exception on error.
  export function updatePositionsAndRotations()
  {
    // ! Throws exception on error.
    getInstance().updatePositionsAndRotations();
  }

  export function newZone(name: string)
  {
    /*
    /// TEST:
    /// Idea: Konstruktor si sám zaregistruje root entitu, pokud
    /// neexistuje.
    const zone = new Zone();
    */

    const zone = Entities.newRootEntity(Zone);

    zone.setName(name);
    // ! Throws exception on error.
    getInstance().addZone(zone);
    zone.init();

    return zone;
  }
}

// ----------------- Auxiliary Functions ---------------------

// ! Throws exception on error.
async function loadZone(id: string)
{
  const directory = Zone.dataDirectory;
  // ! Throws exception on error.
  const zone = (await Entities.loadEntity(directory, id)).dynamicCast(Zone);

  return zone;
}

// ! Throws exception on error.
function getInstance()
{
  if (!instance)
    throw new Error("Zones aren't loaded yet");

  return instance;
}

async function loadZoneList()
{
  const path = FileSystem.composePath(Game.dataDirectory, ZONES_FILE_NAME);
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