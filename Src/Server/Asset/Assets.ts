/*  Part of Kosmud  */

import { Syslog } from "../../Shared/Log/Syslog";
import { ClassFactory } from "../../Shared/Class/ClassFactory";
import { FileSystem } from "../../Server/FileSystem/FileSystem";
import { Game } from "../../Server/Game/Game";
import { Asset } from "../../Server/Asset/Asset";
import { ShapeAsset } from "../../Server/Asset/ShapeAsset";
import { TilemapAsset } from "../../Server/Asset/TilemapAsset";
import { SoundAsset } from "../../Server/Asset/SoundAsset";
import { TextureAsset } from "../../Server/Asset/TextureAsset";
import { TextureAtlasAsset } from "../../Server/Asset/TextureAtlasAsset";
import { Entities } from "../../Server/Class/Entities";
import { Serializable } from "../../Shared/Class/Serializable";

const ASSETS_FILE_NAME = "assets.json";

let instance: Assets | undefined;

// ------------------------ Class ----------------------------

// Assets are saved using an instance of serializable class.
export class Assets extends Serializable
{
  protected static version = 0;

  // ----------------- Private data ---------------------

  private readonly assets = new Set<Asset>();

  // ---------------- Public methods --------------------

  // ! Throws exception on error.
  public addAsset(asset: Asset, name: string)
  {
    asset.setName(name);

    // ! Throws exception on error.
    getInstance().assets.add(asset);
  }

  // ! Throws exception on error.
  public async load()
  {
    for (const asset of this.assets)
    {
      // ! Throws exception on error.
      await this.loadAssetReference(asset);
    }
  }

  public init()
  {
    for (const asset of this.assets)
    {
      // ! Throws exception on error.
      asset.init();
    }
  }

  // ---------------- Private methods -------------------

  // ! Throws exception on error.
  private async loadAssetReference(reference: Asset)
  {
    // If the reference is valid it means it's already loaded.
    if (!reference.isValid())
    {
      // ! Throws exception on error.
      const asset = await loadAssetEntity(reference.getId());

      // ! Throws exception on error.
      await asset.load();

      this.replaceAssetReference(reference, asset);
    }
  }

  private replaceAssetReference
  (
    oldReference: Asset,
    newReference: Asset
  )
  {
    this.assets.delete(oldReference);
    this.assets.add(newReference);
  }
}

ClassFactory.registerClassPrototype(Assets);

// ---------------------- Namespace --------------------------

export namespace Assets
{
  export const dataDirectory = `${Game.dataDirectory}Assets/`;

  // ! Throws exception on error.
  export async function load()
  {
    if (instance)
      throw Error("Instance of Assets already exists");

    // ! Throws exception on error.
    instance = await loadAssetList();

    // ! Throws exception on error.
    await getInstance().load();

    // ! Throws exception on error.
    getInstance().init();
  }

  export async function save()
  {
    // ! Throws exception on error.
    const data = getInstance().serialize("Save to file");

    // ! Throws exception on error.
    await FileSystem.writeFile(Game.dataDirectory, ASSETS_FILE_NAME, data);
  }

  // ! Throws exception on error.
  export function newShapeAsset(name: string)
  {
    const asset = Entities.newRootEntity(ShapeAsset);

    // ! Throws exception on error.
    getInstance().addAsset(asset, name);

    return asset;
  }

  // ! Throws exception on error.
  export function newTilemapAsset(name: string)
  {
    const asset = Entities.newRootEntity(TilemapAsset);

    // ! Throws exception on error.
    getInstance().addAsset(asset, name);

    return asset;
  }

  // ! Throws exception on error.
  export function newSoundAsset(name: string)
  {
    const asset = Entities.newRootEntity(SoundAsset);

    // ! Throws exception on error.
    getInstance().addAsset(asset, name);

    return asset;
  }

  // ! Throws exception on error.
  export function newTextureAsset(name: string)
  {
    const asset = Entities.newRootEntity(TextureAsset);

    // ! Throws exception on error.
    getInstance().addAsset(asset, name);

    return asset;
  }

  // ! Throws exception on error.
  export function newTextureAtlasAsset(name: string)
  {
    const asset = Entities.newRootEntity(TextureAtlasAsset);

    // ! Throws exception on error.
    getInstance().addAsset(asset, name);

    return asset;
  }
}

// ----------------- Auxiliary Functions ---------------------

async function loadAssetList()
{
  const path = FileSystem.composePath(Game.dataDirectory, ASSETS_FILE_NAME);
  // ! Throws exception on error.
  const readResult = await FileSystem.readFile(path);

  if (readResult === "File doesn't exist")
  {
    Syslog.log("[INFO]", `File ${path} doesn't exist, starting with no`
      + ` assets. This is ok only if you are building new data from the`
      + ` scratch, otherwise it's an error`);

    // ! Throws exception on error.
    return ClassFactory.newInstance(Assets);
  }

  // ! Throws exception on error.
  return Serializable.deserialize(readResult.data).dynamicCast(Assets);
}

// ! Throws exception on error.
async function loadAssetEntity(id: string)
{
  // ! Throws exception on error.
  const asset = await Entities.loadEntity(Assets.dataDirectory, id);

  // ! Throws exception on error.
  return asset.dynamicCast(Asset);
}

// ! Throws exception on error.
function getInstance()
{
  if (!instance)
    throw new Error("Assets aren't loaded yet");

  return instance;
}