/*
  Part of Kosmud

  Server-side game simulation.
*/

import { Zones } from "../../Server/Game/Zones";

/// TEST
// import { Zone } from "../../Server/Game/Zone";
import { Entities } from "../../Server/Class/Entities";
import { Ships } from "../../Server/Game/Ships";
import { Assets } from "../../Server/Asset/Assets";
import { ShapeAsset } from "../../Shared/Asset/ShapeAsset";
import { TilemapAsset } from "../../Shared/Asset/TilemapAsset";
import { SoundAsset } from "../../Shared/Asset/SoundAsset";
import { TextureAsset } from "../../Shared/Asset/TextureAsset";
import { TextureAtlasAsset } from "../../Shared/Asset/TextureAtlasAsset";

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

    /// ---------------- TEST ----------------

    const zone = zones.newZone("Test zone");
    const ship = Ships.newShip("Fighter");

    const tilemapAsset = Assets.newTilemapAsset("Basic ships");
    tilemapAsset.path = "Tilemaps/Ships/basic_ships.json";
    ship.setTilemapAsset(tilemapAsset);
    await Assets.saveAsset(tilemapAsset);

    const shapeAsset = Assets.newShapeAsset("Fighter hull");
    shapeAsset.tilemapAsset = tilemapAsset;
    shapeAsset.objectName = "Hull";
    shapeAsset.objectLayerName = "Basic fighter";
    ship.setShapeAsset(shapeAsset);
    await Assets.saveAsset(shapeAsset);

    const exhaustSoundAsset = Assets.newSoundAsset("Exhaust sound 00");
    exhaustSoundAsset.path = "Sound/Ship/Engine/ShipEngine.mp3";
    ship.setExhaustSoundAsset(exhaustSoundAsset);
    await Assets.saveAsset(exhaustSoundAsset);

    zone.addShip(ship);

    await zone.save();
    await zones.save();

    /// ---------------- /TEST ----------------
  }
}

// ----------------- Auxiliary Functions ---------------------

function getZones()
{
  if (zones === "Not loaded")
  {
    throw Error(`Zones aren't loaded yet`);
  }

  return zones;
}