/*  Part of Kosmud  */

import { Zones } from "../../Server/Game/Zones";

/// TEST
// import { Zone } from "../../Server/Game/Zone";
// import { Entities } from "../../Server/Class/Entities";
import { Ships } from "../../Server/Game/Ships";
import { Assets } from "../../Server/Asset/Assets";
// import { ShapeAsset } from "../../Shared/Asset/ShapeAsset";
// import { TilemapAsset } from "../../Shared/Asset/TilemapAsset";
// import { SoundAsset } from "../../Shared/Asset/SoundAsset";
// import { TextureAsset } from "../../Shared/Asset/TextureAsset";
// import { TextureAtlasAsset } from "../../Shared/Asset/TextureAtlasAsset";

let assets: Assets | "Not loaded" = "Not loaded";
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
    assets = await Assets.load();

    // ! Throws exception on error.
    zones = await Zones.load();

    /// ---------------- TEST ----------------

    const zone = zones.newZone("Test zone");
    const ship = Ships.newShip("Fighter");

    const tilemapAsset = assets.newTilemapAsset("Basic ships");
    tilemapAsset.path = "Tilemaps/Ships/basic_ships.json";
    ship.setTilemapAsset(tilemapAsset);
    await assets.saveAsset(tilemapAsset);

    const shapeAsset = assets.newShapeAsset("Fighter hull");
    shapeAsset.setTilemapAsset(tilemapAsset);
    shapeAsset.objectName = "Hull";
    shapeAsset.objectLayerName = "Basic fighter";
    ship.setShapeAsset(shapeAsset);
    await assets.saveAsset(shapeAsset);

    const exhaustSoundAsset = assets.newSoundAsset("Exhaust sound 00");
    exhaustSoundAsset.path = "Sound/Ship/Engine/ShipEngine.mp3";
    ship.setExhaustSoundAsset(exhaustSoundAsset);
    await assets.saveAsset(exhaustSoundAsset);

    await assets.save();

    /// IMPORTANT:
    /// Před tím, než se ship přidá do zóny, je na nově vytvořených
    /// assetech potřeba loadnout data tilemapy a inicializovat shape.
    await tilemapAsset.load();
    shapeAsset.init();

    zone.addVehicle(ship);

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