/*  Part of Kosmud  */

import { Zones } from "../../Server/Game/Zones";

/// TEST
// import { Zone } from "../../Server/Game/Zone";
// import { Entities } from "../../Server/Class/Entities";
// import { Ships } from "../../Server/Game/Ships";
import { Assets } from "../../Server/Asset/Assets";
// import { ShapeAsset } from "../../Shared/Asset/ShapeAsset";
// import { TilemapAsset } from "../../Shared/Asset/TilemapAsset";
// import { SoundAsset } from "../../Shared/Asset/SoundAsset";
// import { TextureAsset } from "../../Shared/Asset/TextureAsset";
// import { TextureAtlasAsset } from "../../Shared/Asset/TextureAtlasAsset";

// let assets: Assets | "Not loaded" = "Not loaded";
// let zones: Zones | "Not loaded" = "Not loaded";

export namespace Game
{
  export const dataDirectory = "./Data/";

  // ! Throws exception on error.
  export function update()
  {
    // ! Throws exception on error.
    Zones.update();
  }

  // ! Throws exception on error.
  export async function load()
  {
    // ! Throws exception on error.
    await Assets.load();

    // ! Throws exception on error.
    await Zones.load();
  }
}