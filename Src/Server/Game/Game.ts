/*
  Part of Kosmud

  Server-side game simulation.
*/

import { Zones } from "../../Server/Game/Zones";

/// TEST
import { Zone } from "../../Server/Game/Zone";
import { Ships } from "../../Server/Game/Ships";

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
    const zone = zones.newZone("Test zone");
    const ship = Ships.newShip("Fighter");
    ship.physics.shapeId = Zone.FIGHTER_SHAPE_ID;
    zone.addShip(ship);
    await zone.save();
    await zones.save();
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