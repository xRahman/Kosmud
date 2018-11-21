/*
  Part of Kosmud

  Part of game universe that fits into one physics world
  (all objects in the same zone can physically influence each other).
*/

import { Ship } from "../../Shared/Game/Ship";
import { ContainerEntity } from "../../Shared/Class/ContainerEntity";
import { Tilemap } from "../../Shared/Engine/Tilemap";
import { Physics } from "../../Shared/Physics/Physics";

export abstract class Zone extends ContainerEntity
{
  protected readonly ships = new Set<Ship>();
  protected readonly tilemaps = new Map<string, Tilemap>();
  protected readonly physicsShapes = new Map<string, Physics.Shape>();

  // ---------------- Public methods --------------------

  // ! Throws exception on error.
  public addShip(ship: Ship)
  {
    if (this.ships.has(ship))
    {
      throw new Error(`Zone ${this.debugId} already has`
        + ` ship ${ship.debugId}`);
    }

    this.addToContents(ship);
    this.ships.add(ship);
    ship.setZone(this);
  }

  public abstract async load(): Promise<void>;

  // ! Throws exception on error.
  public getTilemap(name: string)
  {
    const tilemap = this.tilemaps.get(name);

    if (tilemap === undefined)
    {
      throw new Error(`Failed to find tilemap '${name}' the`
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
        + ` in zone ${this.debugId}. Make sure the shape is preloaded`);
    }

    return shape;
  }

  // --------------- Protected methods ------------------

  protected abstract async createTilemap(config: Zone.TilemapConfig)
  : Promise<Tilemap>;

  protected addTilemap(tilemap: Tilemap)
  {
    this.tilemaps.set(tilemap.getName(), tilemap);
  }

  protected addPhysicsShape(shapeId: string, shape: Physics.Shape)
  {
    this.physicsShapes.set(shapeId, shape);
  }

  protected async loadTilemaps(configs: Array<Zone.TilemapConfig>)
  {
    for (const config of configs)
    {
      const tilemap = await this.createTilemap(config);

      this.addTilemap(tilemap);
    }
  }

  /// TODO: Tohle asi přesunout do Shared, ať to můžu použít i na klientu.
  // ! Throws exception on error.
  protected initShapes(configs: Array<Zone.ShapeConfig>)
  {
    for (const config of configs)
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
}

// ------------------ Type declarations ----------------------

export namespace Zone
{
  export const FIGHTER_SHAPE_ID = "Fighter Shape id";

  const BASIC_SHIPS_TILEMAP = "Basic ships Tilemap";

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
    tilemapName: string;
    tilemapJsonPath: string;
  }

  export interface ShapeConfig
  {
    shapeId: string;
    tilemapName: string;
    objectLayerName: string;
    objectName: string;
  }

  interface PreloadData
  {
    textures: Array<TextureConfig>;
    atlases: Array<TextureAtlasConfig>;
    tilemaps: Array<TilemapConfig>;
    shapes: Array<ShapeConfig>;
  }

  export const preloadData: PreloadData =
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
    tilemaps:
    [
      {
        tilemapName: BASIC_SHIPS_TILEMAP,
        tilemapJsonPath: "Tilemaps/Ships/basic_ships.json"
      }
    ],
    shapes:
    [
      {
        shapeId: FIGHTER_SHAPE_ID,
        tilemapName: BASIC_SHIPS_TILEMAP,
        objectLayerName: "Basic fighter",
        objectName: "Hull"
      }
    ]
  };
}