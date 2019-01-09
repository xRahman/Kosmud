/*  Part of Kosmud  */

import { Serializable } from "../../Shared/Class/Serializable";
import { FileSystem } from "../../Server/FileSystem/FileSystem";
import { Asset } from "../../Shared/Asset/Asset";
import { ShapeAsset } from "../../Shared/Asset/ShapeAsset";
import { TilemapAsset } from "../../Shared/Asset/TilemapAsset";
import { SoundAsset } from "../../Shared/Asset/SoundAsset";
import { TextureAsset } from "../../Shared/Asset/TextureAsset";
import { TextureAtlasAsset } from "../../Shared/Asset/TextureAtlasAsset";
import { Entities } from "../../Server/Class/Entities";

const assetsDataDirectory = "./Data/Assets/";

export class Assets extends Serializable
{
  public static dataDirectory = "./Data/";
  public static fileName = "assets.json";

  private static version = 0;

  private sounds = new Set<SoundAsset>();

  // ------------- Public static methods ----------------

  // ! Throws exception on error.
  public static async load()
  {
    const path = FileSystem.composePath(Assets.dataDirectory, Assets.fileName);

    const readResult = await FileSystem.readFile(path);

    if (readResult === "File doesn't exist")
      return ClassFactory.newInstance(Zones);

    const zones = await loadZoneListFromJson(readResult.data);

    await zones.load();

    return zones;
  }

  export function newShapeAsset(name: string)
  {
    const asset = Entities.newRootEntity(ShapeAsset);

    asset.setName(name);

    return asset;
  }

  export function newTilemapAsset(name: string)
  {
    const asset = Entities.newRootEntity(TilemapAsset);

    asset.setName(name);

    return asset;
  }

  export function newSoundAsset(name: string)
  {
    const asset = Entities.newRootEntity(SoundAsset);

    asset.setName(name);

    return asset;
  }

  export function newTextureAsset(name: string)
  {
    const asset = Entities.newRootEntity(TextureAsset);

    asset.setName(name);

    return asset;
  }

  export function newTextureAtlasAsset(name: string)
  {
    const asset = Entities.newRootEntity(TextureAtlasAsset);

    asset.setName(name);

    return asset;
  }

  export async function saveAsset(asset: Asset)
  {
    // ! Throws exception on error.
    const fileName = Entities.getFileName(asset.getId());

    // ! Throws exception on error.
    const data = asset.serialize("Save to file");

    /// TODO: Loadovat definice assetů z podadresářů podle class name
    ///   by znamenalo savovat className do referencí, takže prozatím
    ///   hodím všechno do Data/Assets.
    /// const directory = `./Data/Assets/${asset.getClassName()}/`;

    // ! Throws exception on error.
    await FileSystem.writeFile(assetsDataDirectory, fileName, data);
  }

  export async function loadAsset(id: string)
  {
    // ! Throws exception on error.
    const entity = await Entities.loadEntity(assetsDataDirectory, id);

    // ! Throws exception on error.
    const asset = entity.dynamicCast(Asset);

    await asset.load();

    return asset;
  }
}