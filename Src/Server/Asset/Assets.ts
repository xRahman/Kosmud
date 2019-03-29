/*  Part of Kosmud  */

// import { Attributes } from "../../Shared/Class/Attributes";
import { Syslog } from "../../Shared/Log/Syslog";
import { ClassFactory } from "../../Shared/Class/ClassFactory";
import { Serializable } from "../../Shared/Class/Serializable";
// import { JsonObject } from "../../Shared/Class/JsonObject";
import { FileSystem } from "../../Server/FileSystem/FileSystem";
// import { Physics } from "../../Shared/Physics/Physics";
// import { Tilemap } from "../../Shared/Engine/Tilemap";
import { Asset } from "../../Shared/Asset/Asset";
import { ServerAsset } from "../../Server/Asset/ServerAsset";
import { ShapeAsset } from "../../Server/Asset/ShapeAsset";
import { TilemapAsset } from "../../Server/Asset/TilemapAsset";
import { SoundAsset } from "../../Server/Asset/SoundAsset";
import { TextureAsset } from "../../Server/Asset/TextureAsset";
import { TextureAtlasAsset } from "../../Server/Asset/TextureAtlasAsset";
import { Entities } from "../../Server/Class/Entities";

const assetsDataDirectory = "./Data/Assets/";

export class Assets extends Serializable
{
  // -------------- Static class data -------------------

  public static dataDirectory = "./Data/";
  public static fileName = "assets.json";

  protected static version = 0;

  private static assetList: Assets | "Doesn't exist" = "Doesn't exist";

  // ----------------- Private data ---------------------

  private readonly assets = new Set<ServerAsset>();

  // ------------- Public static methods ----------------

  // ! Throws exception on error.
  public static async load()
  {
    if (this.assetList !== "Doesn't exist")
      throw Error("Asset list already exists");

    // ! Throws exception on error.
    this.assetList = await loadAssetList();

    // ! Throws exception on error.
    await this.assetList.load();

    // ! Throws exception on error.
    this.assetList.init();
  }

  public newShapeAsset(name: string)
  {
    const asset = Entities.newRootEntity(ShapeAsset);

    asset.setName(name);
    this.assets.add(asset);

    return asset;
  }

  public newTilemapAsset(name: string)
  {
    const asset = Entities.newRootEntity(TilemapAsset);

    asset.setName(name);
    this.assets.add(asset);

    return asset;
  }

  public newSoundAsset(name: string)
  {
    const asset = Entities.newRootEntity(SoundAsset);

    asset.setName(name);
    this.assets.add(asset);

    return asset;
  }

  public newTextureAsset(name: string)
  {
    const asset = Entities.newRootEntity(TextureAsset);

    asset.setName(name);
    this.assets.add(asset);

    return asset;
  }

  public newTextureAtlasAsset(name: string)
  {
    const asset = Entities.newRootEntity(TextureAtlasAsset);

    asset.setName(name);

    return asset;
  }

  public async saveAsset(asset: Asset)
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

  public async loadAsset(id: string)
  {
    // ! Throws exception on error.
    const entity = await Entities.loadEntity(assetsDataDirectory, id);

    // ! Throws exception on error.
    const asset = entity.dynamicCast(Asset);

    // await asset.load();

    return asset;
  }

  public async save()
  {
    // ! Throws exception on error.
    const data = this.serialize("Save to file");

    // ! Throws exception on error.
    await FileSystem.writeFile(Assets.dataDirectory, Assets.fileName, data);
  }

  // ---------------- Private methods -------------------

  // ! Throws exception on error.
  private async load()
  {
    for (const asset of this.assets)
    {
      // ! Throws exception on error.
      await this.loadEntity(asset);
    }
  }

  private init()
  {
    for (const asset of this.assets)
    {
      // ! Throws exception on error.
      asset.init();
    }
  }

  private async loadEntity(asset: ServerAsset)
  {
    // When asset list is loaded, it contains invalid references
    // to asset enties (because they haven't been loaded yet).
    if (!asset.isValid())
    {
      // ! Throws exception on error.
      const loadedAsset = await loadAssetEntity(asset.getId());

      // ! Throws exception on error.
      await loadedAsset.load();

      this.replaceAssetReference(asset, loadedAsset);
    }
  }

  private replaceAssetReference
  (
    oldReference: ServerAsset,
    newReference: ServerAsset
  )
  {
    this.assets.delete(oldReference);
    this.assets.add(newReference);
  }

//   // ! Throws exception on error.
//   protected initShapes()
//   {
//     for (const shapeAsset of this.shapeAssets)
//     {
//       // ! Throws exception on error.
//       const tilemap = shapeAsset.getTilemapAsset().getTilemap();

//       // ! Throws exception on error.
//       const shape = tilemap.getShape
//       (
//         shapeAsset.objectLayerName,
//         shapeAsset.objectName
//       );

//       shapeAsset.setShape(shape);
//     }
//   }
}

// ----------------- Auxiliary Functions ---------------------

async function loadAssetList()
{
  const path = FileSystem.composePath(Assets.dataDirectory, Assets.fileName);
  // ! Throws exception on error.
  const readResult = await FileSystem.readFile(path);

  if (readResult === "File doesn't exist")
  {
    Syslog.log("[INFO]", `File ${path} doesn't exist, starting with no`
      + ` assets. This should only happen when you are building new data`
      + ` from the scratch, otherwise it's an error`);

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
  const asset = await Entities.loadEntity(assetsDataDirectory, id);

  // ! Throws exception on error.
  return asset.dynamicCast(ServerAsset);
}

// // ! Throws exception on error.
// async function loadTilemap(tilemapAsset: TilemapAsset)
// {
//   const tilemapJsonPath = `./Client/${tilemapAsset.path}`;

//   // ! Throws exception on error.
//   const jsonData = await loadTilemapJsonData(tilemapJsonPath);

//   // ! Throws exception on error.
//   tilemapAsset.setTilemap(new Tilemap(tilemapAsset.getId(), jsonData));
// }

// // ! Throws exception on error.
// async function loadTilemapJsonData(jsonFilePath: string)
// {
//   // ! Throws exception on error.
//   const jsonData = await FileSystem.readExistingFile(jsonFilePath);

//   // ! Throws exception on error.
//   return JsonObject.parse(jsonData);
// }

ClassFactory.registerClassPrototype(Assets);