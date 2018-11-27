/*
  Part of Kosmud

  Part of game universe that fits into one physics world
  (all objects in the same zone can physically influence each other).
*/

import { REPORT } from "../../Shared/Log/REPORT";
import { Ship } from "../../Shared/Game/Ship";
import { Tilemap } from "../../Shared/Engine/Tilemap";
import { PhysicsWorld } from "../../Shared/Physics/PhysicsWorld";
import { Physics } from "../../Shared/Physics/Physics";
import { ContainerEntity } from "../../Shared/Class/ContainerEntity";

export abstract class Zone extends ContainerEntity
{
  protected readonly assets: Zone.Assets =
  {
    textures:
    [
      {
        textureId: "Basic ships Texture",
        texturePath: "Textures/Ships/basic_ships.png"
      }
    ],
    atlases:
    [
      {
        atlasId: "Exhaust yellow rectangular Texture atlas",
        atlasJsonPath:
          "Textures/Effects/Exhausts/ExhaustYellowRectangular.json",
        textureDirectory: "Textures/Effects/Exhausts"
      }
    ],
    sounds:
    [
      {
        soundId: Zone.SHIP_SOUND_ID,
        soundPath: "Sound/Ship/Engine/ShipEngine.mp3"
      }
    ],
    tilemaps:
    [
      {
        tilemapId: Zone.BASIC_SHIPS_TILEMAP_ID,
        tilemapJsonPath: "Tilemaps/Ships/basic_ships.json"
      }
    ],
    shapes:
    [
      {
        shapeId: Zone.FIGHTER_SHAPE_ID,
        tilemapName: Zone.BASIC_SHIPS_TILEMAP_ID,
        objectLayerName: "Basic fighter",
        objectName: "Hull"
      }
    ]
  };

  protected readonly ships = new Map<string, Ship>();
  protected readonly tilemaps = new Map<string, Tilemap>();
  protected readonly physicsShapes = new Map<string, Physics.Shape>();

  private physicsWorld: PhysicsWorld | "Doesn't exist" =
    "Doesn't exist";

  // ---------------- Public methods --------------------

  // ! Throws exception on error.
  public getTilemap(name: string)
  {
    const tilemap = this.tilemaps.get(name);

    if (tilemap === undefined)
    {
      throw new Error(`Failed to find tilemap '${name}' in the`
        + ` list of loaded tilemaps in zone ${this.debugId}`);
    }

    return tilemap;
  }

  // ! Throws exception on error.
  public getPhysicsShape(shapeId: string)
  {
    const shape = this.physicsShapes.get(shapeId);

    if (shape === undefined)
    {
      throw new Error(`Failed to find physics shape with id '${shapeId}'`
        + ` in zone ${this.debugId}. Make sure the shape is correctly`
        + ` listed in zone assets`);
    }

    return shape;
  }

  // ! Throws exception on error.
  public addShip(ship: Ship)
  {
    if (this.ships.has(ship.getId()))
    {
      throw new Error(`Zone ${this.debugId} already has`
        + ` ship ${ship.debugId}`);
    }

    this.addToContents(ship);
    this.ships.set(ship.getId(), ship);
    ship.setZone(this);

    ship.addToPhysicsWorld
    (
      // ! Throws exception on error.
      this.getPhysicsWorld(),
      this
    );
  }

  protected getShip(id: string): Ship | "Not found"
  {
    const ship = this.ships.get(id);

    if (ship === undefined)
      return "Not found";

    return ship;
  }

  // ! Throws exception on error.
  public createPhysicsWorld()
  {
    if (this.physicsWorld !== "Doesn't exist")
    {
      throw new Error(`Zone ${this.debugId} alread has a physics world`);
    }

    this.physicsWorld = Physics.createWorld();
  }

  public update()
  {
    this.steerVehicles();
  }

  // --------------- Protected methods ------------------

  protected addTilemap(tilemap: Tilemap)
  {
    this.tilemaps.set(tilemap.getName(), tilemap);
  }

  protected addPhysicsShape(shapeId: string, shape: Physics.Shape)
  {
    this.physicsShapes.set(shapeId, shape);
  }

  // ! Throws exception on error.
  protected initShapes()
  {
    for (const config of this.assets.shapes)
    {
      // ! Throws exception on error.
      const tilemap = this.getTilemap(config.tilemapName);

      // ! Throws exception on error.
      const shape = tilemap.getShape
      (
        config.objectLayerName,
        config.objectName
      );

      this.addPhysicsShape(config.shapeId, shape);
    }
  }

  // ---------------- Private methods -------------------

  public steerVehicles()
  {
    for (const ship of this.ships.values())
    {
      steerShip(ship);
    }
  }

  // ! Throws exception on error.
  private getPhysicsWorld()
  {
    if (this.physicsWorld === "Doesn't exist")
    {
      throw new Error(`Zone ${this.debugId} doesn't have a physics`
      + ` world yet. Make sure that you call createPhysicsWorld()`
      + ` before you try to do anything with it`);
    }

    return this.physicsWorld;
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

export namespace Zone
{
  export const FIGHTER_SHAPE_ID = "Fighter shape";
  export const BASIC_SHIPS_TILEMAP_ID = "Basic ships Tilemap";
  export const SHIP_SOUND_ID = "Ship Engine Sound";

  export interface SoundConfig
  {
    soundId: string;
    soundPath: string;
  }

  export interface TextureConfig
  {
    textureId: string;
    texturePath: string;
  }

  export interface TextureAtlasConfig
  {
    atlasId: string;
    atlasJsonPath: string;
    textureDirectory: string;
  }

  export interface TilemapConfig
  {
    tilemapId: string;
    tilemapJsonPath: string;
  }

  export interface ShapeConfig
  {
    shapeId: string;
    tilemapName: string;
    objectLayerName: string;
    objectName: string;
  }

  export interface Assets
  {
    textures: Array<TextureConfig>;
    atlases: Array<TextureAtlasConfig>;
    sounds: Array<SoundConfig>;
    tilemaps: Array<TilemapConfig>;
    shapes: Array<ShapeConfig>;
  }
}