/*  Part of Kosmud  */

/*
// import { Attributes } from "../../Shared/Class/Attributes";
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
import { Entity } from "../../Shared/Class/Entity";
import { Entities } from "../../Server/Class/Entities";

export abstract class EntityList<T extends Entity> extends Serializable
{
  public static dataDirectory = "./Data/";
  public static fileName = "assets.json";

  protected static instance: EntityList<Entity> | undefined =
    undefined;

  private readonly entities = new Set<T>();

  // ------------- Public static methods ----------------

  // ! Throws exception on error.
  public static async load()
  {
    // ! Throws exception on error.
    this.instance = await this.loadInstance();

    // ! Throws exception on error.
    await this.instance.load();

    /// TODO: Přetížit load() v potomkovi.
    // // ! Throws exception on error.
    // await entities.loadAssetData();

    // entities.init();

    return entities;
  }

  // ------------ Protected static methods --------------

  protected static getInstance()
  {
    if (this.instance === undefined)
    {
      throw Error(`Missing instance in ${this.name}. Make sure
        that 'instance' is initialized in descendants`);
    }

    return this.instance;
  }

  // ------------- Private static methods ---------------

  private static loadInstance()
  {
    const path = FileSystem.composePath
    (
      EntityList.dataDirectory,
      this.fileName
    );
    // ! Throws exception on error.
    const readResult = await FileSystem.readFile(path);

    if (readResult === "File doesn't exist")
      // ! Throws exception on error.
      return ClassFactory.newInstance(EntityList);

    // ! Throws exception on error.
    return Serializable.deserialize(readResult.data).dynamicCast(EntityList);
  }

  // ---------------- Public methods --------------------

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

  // --------------- Protected methods ------------------

  protected asyc load()
  {
  }

  // ---------------- Private methods -------------------

  // ! Throws exception on error.
  private async loadAssetDescriptors()
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
        const loadedAsset = await loadAssetDescriptor(asset.getId());

        this.replaceAssetReference(asset, loadedAsset);
      }
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

  // ! Throws exception on error.
  private async loadAssetData()
  {
    for (const asset of this.assets)
    {
      if (asset.load !== undefined)
      {
        // ! Throws exception on error.
        await asset.load();
      }
    }
  }

  private init()
  {
    for (const asset of this.assets)
    {
      if (asset.init !== undefined)
      {
        // ! Throws exception on error.
        asset.init();
      }
    }
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

// ! Throws exception on error.
async function loadAssetDescriptor(id: string)
{
  // ! Throws exception on error.
  const entity = await Entities.loadEntity(assetsDataDirectory, id);

  // ! Throws exception on error.
  // Note that ServerAsset is just an interface so unfortunately
  // we can't typecheck it in runtime and we need to typecast.
  return entity.dynamicCast(Asset) as ServerAsset;
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
*/