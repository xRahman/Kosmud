/*
  Part of Kosmud

  Textures, texture atlases, sounds, etc.
*/

import { FileSystem } from "../../Server/FileSystem/FileSystem";
import { Asset } from "../../Shared/Asset/Asset";
import { ShapeAsset } from "../../Shared/Asset/ShapeAsset";
import { TilemapAsset } from "../../Shared/Asset/TilemapAsset";
import { SoundAsset } from "../../Shared/Asset/SoundAsset";
import { TextureAsset } from "../../Shared/Asset/TextureAsset";
import { TextureAtlasAsset } from "../../Shared/Asset/TextureAtlasAsset";
import { Entities } from "../../Server/Class/Entities";

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

    const directory = `./Data/Assets/${asset.getClassName()}/`;

    // ! Throws exception on error.
    await FileSystem.writeFile(directory, fileName, data);
  }

/// Vzor pro případný loadování assetů přes Assets.loadAsset().
// export async function loadAccount()
// {
//   // TODO: Determine account id.
//   /// (Zatím natvrdo.)
//   const accountId = "1-jq6wqw3s";

//   // ! Throws exception on error.
// const entity = await Entities.loadEntity(Account.dataDirectory, accountId);

//   // ! Throws exception on error.
//   return entity.dynamicCast(Account);
// }
}