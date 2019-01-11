/*
  Part of Kosmud

  Part of game world that fits into one physics world
  (all objects in the same zone can physically influence each other).
*/

import { REPORT } from "../../Shared/Log/REPORT";
import { Attributes } from "../../Shared/Class/Attributes";
import { Serializable } from "../../Shared/Class/Serializable";
import { Entities } from "../../Shared/Class/Entities";
import { Ship } from "../../Shared/Game/Ship";
import { Asset } from "../../Shared/Asset/Asset";
import { ShapeAsset } from "../../Shared/Asset/ShapeAsset";
// import { TilemapAsset } from "../../Shared/Asset/TilemapAsset";
// import { SoundAsset } from "../../Shared/Asset/SoundAsset";
// import { Tilemap } from "../../Shared/Engine/Tilemap";
import { PhysicsWorld } from "../../Shared/Physics/PhysicsWorld";
import { Physics } from "../../Shared/Physics/Physics";
import { CONTENTS, ContainerEntity } from "../../Shared/Class/ContainerEntity";
import { GameEntity } from "../../Shared/Game/GameEntity";

export abstract class Zone extends ContainerEntity<GameEntity>
{
  // protected readonly assets: Zone.Assets =
  // {
  //   textures:
  //   [
  //     {
  //       textureId: "Basic ships Texture",
  //       texturePath: "Textures/Ships/basic_ships.png"
  //     }
  //   ],
  //   atlases:
  //   [
  //     {
  //       atlasId: "Exhaust yellow rectangular Texture atlas",
  //       atlasJsonPath:
  //         "Textures/Effects/Exhausts/ExhaustYellowRectangular.json",
  //       textureDirectory: "Textures/Effects/Exhausts"
  //     }
  //   ],
  //   sounds:
  //   [
  //     {
  //       soundId: Zone.SHIP_SOUND_ID,
  //       soundPath: "Sound/Ship/Engine/ShipEngine.mp3"
  //     }
  //   ],
  //   tilemaps:
  //   [
  //     {
  //       tilemapId: Zone.BASIC_SHIPS_TILEMAP_ID,
  //       tilemapJsonPath: "Tilemaps/Ships/basic_ships.json"
  //     }
  //   ],
  //   shapes:
  //   [
  //     {
  //       shapeId: Zone.FIGHTER_SHAPE_ID,
  //       tilemapName: Zone.BASIC_SHIPS_TILEMAP_ID,
  //       objectLayerName: "Basic fighter",
  //       objectName: "Hull"
  //     }
  //   ]
  // };

  protected readonly ships = new Set<Ship>();

  // protected readonly tilemaps = new Map<string, Tilemap>();
  // protected static tilemaps: Attributes =
  // {
  //   saved: false, sentToClient: false
  // };

  // protected readonly physicsShapes = new Map<string, Physics.Shape>();
  // protected static physicsShapes: Attributes =
  // {
  //   saved: false, sentToClient: false
  // };

  private physicsWorld: PhysicsWorld | "Doesn't exist" = "Doesn't exist";
  protected static physicsWorld: Attributes =
  {
    saved: false, sentToClient: false
  };

  // ---------------- Public methods --------------------

  // // ! Throws exception on error.
  // public getTilemap(name: string)
  // {
  //   const tilemap = this.tilemaps.get(name);

  //   if (tilemap === undefined)
  //   {
  //     throw Error(`Failed to find tilemap '${name}' in the`
  //       + ` list of loaded tilemaps in zone ${this.debugId}`);
  //   }

  //   return tilemap;
  // }

  // // ! Throws exception on error.
  // public getPhysicsShape(shapeId: string)
  // {
  //   const shape = this.physicsShapes.get(shapeId);

  //   if (shape === undefined)
  //   {
  //     throw Error(`Failed to find physics shape with id '${shapeId}'`
  //       + ` in zone ${this.debugId}. Make sure the shape is listed in`
  //       + ` zone assets`);
  //   }

  //   return shape;
  // }

  // ! Throws exception on error.
  public addShip(ship: Ship)
  {
    if (this.ships.has(ship))
    {
      throw Error(`Zone ${this.debugId} already has`
        + ` ship ${ship.debugId}`);
    }

    this.insert(ship);
    this.ships.add(ship);
    ship.setZone(this);

    /// HACK (dočasný na testování serializace zóny)
    // ship.addToPhysicsWorld
    // (
    //   // ! Throws exception on error.
    //   this.getPhysicsWorld(),
    //   this
    // );
  }

  // protected getShip(id: string): Ship | "Not found"
  // {
  //   const ship = this.ships.get(id);

  //   if (ship === undefined)
  //     return "Not found";

  //   return ship;
  // }

  public update()
  {
    this.steerVehicles();
  }

  // Called after zone is loaded or created.
  public init()
  {
    this.createPhysicsWorld();
  }

  public compileListOfAssets()
  {
    const assets = new Set<Asset>();

    // TODO: Předělat (entity v zóně nemůžou být v contents).
    for (const entity of this.getContents())
    {
      const entityAssets = entity.getAssets();

      for (const asset of entityAssets)
      {
        // For the deduplication to work we need to make sure
        // that we put only valid references to the set. It's
        // because even though there can only be one valid
        // reference to an entity, there can be any number
        // of invalid references to it as well.
        //   Also when the asset descriptor is deleted (so it
        // get's invalid), we don't want to send it to the client
        // anyways).
        if (asset.isValid())
          assets.add(asset);
      }
    }

    return assets;
  }

  // --------------- Protected methods ------------------

  // protected addTilemap(tilemap: Tilemap)
  // {
  //   this.tilemaps.set(tilemap.getName(), tilemap);
  // }

  // protected addPhysicsShape(shapeId: string, shape: Physics.Shape)
  // {
  //   this.physicsShapes.set(shapeId, shape);
  // }

  // // ! Throws exception on error.
  // protected initShapes()
  // {
  //   for (const config of this.assets.shapes)
  //   {
  //     // ! Throws exception on error.
  //     const tilemap = this.getTilemap(config.tilemapName);

  //     // ! Throws exception on error.
  //     const shape = tilemap.getShape
  //     (
  //       config.objectLayerName,
  //       config.objectName
  //     );

  //     this.addPhysicsShape(config.shapeId, shape);
  //   }
  // }

  // ~ Overrides Serializable.customSerializeProperty.
  // Serialize all entities from zones's 'contents' to the same save file.
  protected customSerializeProperty(param: Serializable.SerializeParam): any
  {
    if (param.property === this.getContents())
      return this.serializeContents(param.property, param.mode);

    return "Property isn't serialized customly";
  }

  // ~ Overrides Serializable.customDeserializeProperty.
  // Deserialize all saved contained entities when zone is deserialized.
  protected customDeserializeProperty(param: Serializable.DeserializeParam)
  {
    if (param.propertyName === CONTENTS)
      return this.deserializeContents(param.sourceProperty);

    return "Property isn't deserialized customly";
  }

  // ---------------- Private methods -------------------

  // ! Throws exception on error.
  private createPhysicsWorld()
  {
    if (this.physicsWorld !== "Doesn't exist")
    {
      throw Error(`Zone ${this.debugId} alread has a physics world`);
    }

    this.physicsWorld = Physics.createWorld();
  }

  private steerVehicles()
  {
    for (const ship of this.ships.values())
      steerShip(ship);
  }

  // ! Throws exception on error.
  private getPhysicsWorld()
  {
    if (this.physicsWorld === "Doesn't exist")
    {
      throw Error(`Zone ${this.debugId} doesn't have a physics`
      + ` world yet. Make sure that you call createPhysicsWorld()`
      + ` before you try to do anything with it`);
    }

    return this.physicsWorld;
  }

  private serializeContents
  (
    contents: Set<ContainerEntity<GameEntity>>,
    mode: Serializable.Mode
  )
  {
    const serializedContents = new Array<object>();

    // Unlike other entities, zone saves all of it's containing
    // entities into the same json.
    for (const entity of contents)
      serializedContents.push(entity.saveToJsonObject(mode));

    const result =
    {
      className: "EntityContents",
      version: 0,
      contents: serializedContents
    };

    return result;
  }

  private deserializeContents(sourceProperty: object)
  {
    const contents = new Set();
    const serializedContents =
      (sourceProperty as any)[CONTENTS] as Array<object>;

    for (const serializedEntity of serializedContents)
    {
      const entity = Entities.loadEntityFromJsonObject(serializedEntity);

      contents.add(entity);
    }

    return contents;
  }
}

// ----------------- Auxiliary Functions ---------------------

function steerShip(ship: Ship)
{
  try
  {
    ship.steer();
  }
  catch (error)
  {
    REPORT(error, `Failed to steer ship ${ship.debugId}`);
  }
}

// ------------------ Type declarations ----------------------

// export namespace Zone
// {
//   export const FIGHTER_SHAPE_ID = "Fighter shape";
//   export const BASIC_SHIPS_TILEMAP_ID = "Basic ships Tilemap";
//   export const SHIP_SOUND_ID = "Ship Engine Sound";

//   export interface SoundConfig
//   {
//     soundId: string;
//     soundPath: string;
//   }

//   export interface TextureConfig
//   {
//     textureId: string;
//     texturePath: string;
//   }

//   export interface TextureAtlasConfig
//   {
//     atlasId: string;
//     atlasJsonPath: string;
//     textureDirectory: string;
//   }

//   export interface TilemapConfig
//   {
//     tilemapId: string;
//     tilemapJsonPath: string;
//   }

//   export interface ShapeConfig
//   {
//     shapeId: string;
//     tilemapName: string;
//     objectLayerName: string;
//     objectName: string;
//   }

//   export interface Assets
//   {
//     textures: Array<TextureConfig>;
//     atlases: Array<TextureAtlasConfig>;
//     sounds: Array<SoundConfig>;
//     tilemaps: Array<TilemapConfig>;
//     shapes: Array<ShapeConfig>;
//   }
// }