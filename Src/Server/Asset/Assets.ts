/*  Part of Kosmud  */

import { FileSystem } from "../../Server/FileSystem/FileSystem";
import { Asset } from "../../Shared/Asset/Asset";
import { ShapeAsset } from "../../Shared/Asset/ShapeAsset";
import { TilemapAsset } from "../../Shared/Asset/TilemapAsset";
import { SoundAsset } from "../../Shared/Asset/SoundAsset";
import { TextureAsset } from "../../Shared/Asset/TextureAsset";
import { TextureAtlasAsset } from "../../Shared/Asset/TextureAtlasAsset";
import { Entities } from "../../Server/Class/Entities";

const assetsDataDirectory = "./Data/Assets/";

export namespace Assets
{
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
    return entity.dynamicCast(Asset);
  }
}