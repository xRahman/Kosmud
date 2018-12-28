/*
  Part of Kosmud

  Server-side game simulation.
*/

// import { Zone } from "../../Server/Game/Zone";
import { Zones } from "../../Server/Game/Zones";
// import { Connections } from "../../Server/Net/Connections";

/// TEST
// import { Ship } from "../../Server/Game/Ship";

let zones: Zones | "Not loaded" = "Not loaded";

export namespace Game
{
  export function update()
  {
    getZones().update();
  }

  // ! Throws exception on error.
  export async function load()
  {
    // ! Throws exception on error.
    zones = await Zones.load();

    /// TEST
    // const zone = zones.newZone();
    // await zone.save();
    // await zones.save();
  }
}

// ----------------- Auxiliary Functions ---------------------

function getZones()
{
  if (zones === "Not loaded")
  {
    throw new Error(`Zones aren't loaded yet`);
  }

  return zones;
}