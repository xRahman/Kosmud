/*  Part of Kosmud  */

// import { Attributes } from "../../Shared/Class/Attributes";
import { ClassFactory } from "../../Shared/Class/ClassFactory";
import { Serializable } from "../../Shared/Class/Serializable";
import { JsonObject } from "../../Shared/Class/JsonObject";
import { FileSystem } from "../../Server/FileSystem/FileSystem";
// import { Physics } from "../../Shared/Physics/Physics";
import { Tilemap } from "../../Shared/Engine/Tilemap";
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

  protected static version = 0;

  private assets = new Set<Asset>();
  private tilemapAssets = new Set<TilemapAsset>();
  private shapeAssets = new Set<ShapeAsset>();

  // ------------- Public static methods ----------------

  // ! Throws exception on error.
  public static async load()
  {
    // ! Throws exception on error.
    const assets = await loadListOfAssets();

    // ! Throws exception on error.
    await assets.loadAssetEntities();

    // ! Throws exception on error.
    await assets.loadTilemaps();

    return assets;
  }

  public newShapeAsset(name: string)
  {
    const asset = Entities.newRootEntity(ShapeAsset);

    asset.setName(name);
    this.assets.add(asset);
    this.shapeAssets.add(asset);

    return asset;
  }

  public newTilemapAsset(name: string)
  {
    const asset = Entities.newRootEntity(TilemapAsset);

    asset.setName(name);
    this.assets.add(asset);
    this.tilemapAssets.add(asset);

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
  private async loadAssetEntities()
  {
    // Entities listed in this.assets hasn't been loaded yet,
    // the list contains only "invalid entity references".
    //   So we iterate through these invalid references, load
    // each asset using id stored in the reference and replace
    // the invalid reference with a newly loaded zone.
    for (const asset of this.assets)
    {
      if (!asset.isValid())
      {
        // ! Throws exception on error.
        const loadedAsset = await loadAssetEntity(asset.getId());

        this.replaceAssetReference(asset, loadedAsset);
      }
    }
  }

  private replaceAssetReference(oldReference: Asset, newReference: Asset)
  {
    this.assets.delete(oldReference);
    this.assets.add(newReference);
  }

  // ! Throws exception on error.
  private async loadTilemaps()
  {
    for (const tilemapAsset of this.tilemapAssets)
    {
      // ! Throws exception on error.
      await loadTilemap(tilemapAsset);
    }
  }

  // ! Throws exception on error.
  protected initShapes()
  {
    for (const shapeAsset of this.shapeAssets)
    {
      // ! Throws exception on error.
      const tilemap = shapeAsset.getTilemapAsset().getTilemap();

      // ! Throws exception on error.
      const shape = tilemap.getShape
      (
        shapeAsset.objectLayerName,
        shapeAsset.objectName
      );

      shapeAsset.setShape(shape);
    }
  }
}

// ----------------- Auxiliary Functions ---------------------

async function loadListOfAssets()
{
  const path = FileSystem.composePath(Assets.dataDirectory, Assets.fileName);
  // ! Throws exception on error.
  const readResult = await FileSystem.readFile(path);

  if (readResult === "File doesn't exist")
    // ! Throws exception on error.
    return ClassFactory.newInstance(Assets);

  // ! Throws exception on error.
  return Serializable.deserialize(readResult.data).dynamicCast(Assets);
}

// ! Throws exception on error.
async function loadAssetEntity(id: string)
{
  const directory = Assets.dataDirectory;

  // ! Throws exception on error.
  return (await Entities.loadEntity(directory, id)).dynamicCast(Asset);
}

// ! Throws exception on error.
async function loadTilemap(tilemapAsset: TilemapAsset)
{
  const tilemapJsonPath = `./Client/${tilemapAsset.path}`;

  // ! Throws exception on error.
  const jsonData = await loadTilemapJsonData(tilemapJsonPath);

  // ! Throws exception on error.
  tilemapAsset.setTilemap(new Tilemap(tilemapAsset.getId(), jsonData));
}

// ! Throws exception on error.
async function loadTilemapJsonData(jsonFilePath: string)
{
  // ! Throws exception on error.
  const jsonData = await FileSystem.readExistingFile(jsonFilePath);

  // ! Throws exception on error.
  return JsonObject.parse(jsonData);
}

ClassFactory.registerClassPrototype(Assets);