/*
  Server implementation of Tilemap.
*/

import { Physics } from "../../Shared/Physics/Physics";
import { JsonObject } from "../../Shared/Class/JsonObject";
import { FileSystem } from "../../Server/FileSystem/FileSystem";
import * as Shared from "../../Shared/Physics/Tilemap";

export class Tilemap extends Shared.Tilemap
{
  private data: Shared.Tilemap.Data | "Not loaded" = "Not loaded";

  constructor(name: string, protected jsonFilePath: string)
  {
    super(name);
  }

  // ---------------- Public methods --------------------

  // ! Throws exception on error.
  public async load()
  {
    // ! Throws exception on error.
    const jsonData = await FileSystem.readExistingFile(this.jsonFilePath);

    // ! Throws exception on error.
    this.data = (JsonObject.parse(jsonData) as Shared.Tilemap.Data);

    // ! Throws exception on error.
    indexData(this.data, this.name);
  }

  // ! Throws exception on error.
  public getShape()
  {
    if (this.data === "Not loaded")
    {
      throw new Error(`Failed to get physics shape from tilemap`
        + ` '${this.name}' because the tilemap is not loaded`);
    }

    /// TODO: Tohle časem parametrizovat (a brát to ze stejnýho
    ///   zdroje jako klient).
    const layerName = "Basic fighter";
    const objectName = "Hull";

    // ! Throws exception on error.
    const hullTileGid = getHullTileGid
    (
      this.data, layerName, objectName, this.name
    );

    // ! Throws exception on error.
    return getTileShape(this.data, hullTileGid, objectName, this.name);
  }
}

// ----------------- Auxiliary Functions ---------------------

// ! Throws exception on error.
function indexData(data: Shared.Tilemap.Data, tilemapName: string)
{
  // ! Throws exception on error.
  indexLayers(data, tilemapName);

  // ! Throws exception on error.
  indexTiles(data, tilemapName);
}

// ! Throws exception on error.
function indexLayers(data: Shared.Tilemap.Data, tilemapName: string)
{
  if (data.layersMap !== undefined)
  {
    throw new Error(`Hashmap of layers already`
      + ` exists in tilemap '${tilemapName}'`);
  }

  data.layersMap = new Map();

  for (const layer of data.layers)
  {
    if (!layer.name)
    {
      throw new Error(`One of layers of tilemap '${tilemapName}'`
        + ` doesn't have a name`);
    }

    data.layersMap.set(layer.name, layer);

    // ! Throws exception on error.
    indexLayer(layer, tilemapName);
  }
}

// ! Throws exception on error.
function indexLayer(layer: Shared.Tilemap.Layer, tilemapName: string)
{
  if (layer.objectsMap !== undefined)
  {
    throw new Error(`Hashmap of objects already exists`
      + ` in layer '${layer.name}' of tilemap '${tilemapName}'`);
  }

  layer.objectsMap = new Map();

  for (const object of layer.objects)
  {
    if (!object.name)
    {
      throw new Error(`One of objects in layer '${layer.name}'`
        + ` of tilemap '${tilemapName}' doesn't have a name`);
    }

    // There can be more objects with the same name
    // so we store them as array.

    let array = layer.objectsMap.get(object.name);

    if (array === undefined)
      array = [];

    array.push(object);
    layer.objectsMap.set(object.name, array);
  }
}

// ! Throws exception on error.
function indexTiles(data: Shared.Tilemap.Data, tilemapName: string)
{
  if (data.tilesMap !== undefined)
  {
    throw new Error(`Hashmap of tiles already`
      + ` exists in tilemap '${tilemapName}'`);
  }

  data.tilesMap = new Map();

  for (const tileset of data.tilesets)
  {
    indexTileset(tileset, data.tilesMap);
  }
}

function indexTileset
(
  tileset: Shared.Tilemap.Tileset,
  tilesMap: Map<number, Shared.Tilemap.Tile>
)
{
  for (const tile of tileset.tiles)
  {
    tilesMap.set(tile.id + tileset.firstgid, tile);
  }
}

function getLayer
(
  data: Shared.Tilemap.Data,
  layerName: string,
  tilemapName: string
)
{
  if (data.layersMap === undefined)
  {
    throw new Error(`Tilemap '${tilemapName}' doesn't have`
      + ` a 'layersMap' property. It needs to be initialized`
      + ` after loading`);
  }

  const layer = data.layersMap.get(layerName);

  if (layer === undefined)
  {
    throw new Error(`Tilemap '${tilemapName}' doesn't`
      + ` have layer '${layerName}'`);
  }

  return layer;
}

function getObjects
(
  layer: Shared.Tilemap.Layer,
  objectName: string,
  tilemapName: string
)
{
  if (layer.objectsMap === undefined)
  {
    throw new Error(`Layer '${layer.name}' of tilemap '${tilemapName}'`
      + ` doesn't have an 'objectsMap' property. It needs to be`
      + ` initialized after loading`);
  }

  const objects = layer.objectsMap.get(objectName);

  if (objects === undefined)
  {
    throw new Error(`There are no '${objectName}' objects`
      + ` in layer '${layer.name}' of tilemap '${tilemapName}'`);
  }

  return objects;
}

// ! Throws exception on error.
function getHullTileGid
(
  data: Shared.Tilemap.Data,
  layerName: string,
  objectName: string,
  tilemapName: string
)
{
  const layer = getLayer(data, layerName, tilemapName);
  const objects = getObjects(layer, objectName, tilemapName);

  if (objects.length !== 1)
  {
    throw new Error(`Failed to get physics shape from tilemap`
      + ` '${tilemapName}' because there is more (or less) than one`
      + ` '${objectName}' object in it's '${layerName}' layer`);
  }

  const hullTileGid = objects[0].gid;

  if (hullTileGid === undefined)
  {
    throw new Error(`Failed to get physics shape from tilemap`
    + ` '${tilemapName}' because object '${objectName}' in layer`
    + ` '${layerName}' doesn't have a 'gid' property. Make sure`
    + ` that ship hull object is a tile in Tiled editor`);
  }

  return hullTileGid;
}

// ! Throws exception on error.
function getTileShape
(
  data: Shared.Tilemap.Data,
  tileGid: number,
  layerObjectName: string,
  tilemapName: string
)
{
  // ! Throws exception on error.
  const tile = getTile(data, tileGid, tilemapName);

  if (tile.objectgroup === undefined)
  {
    throw new Error(`Failed to get physics shape from tilemap`
      + ` '${tilemapName}' because tile with gid '${tileGid}'`
      + ` corresponding to layer object '${layerObjectName}'`
      + ` doesn't have an 'objectgroup' in it. You probably`
      + ` forgot to edit it's physic shape in Tiled editor`);
  }

  const shape: Array<Physics.Polygon> = [];

  for (const object of tile.objectgroup.objects)
  {
    if (object.polygon === undefined)
    {
      throw new Error(`Failed to get physics shape from tilemap`
        + ` '${tilemapName}' because object '${object.name}' in`
        + ` tile with gid '${tileGid}' corresponding to layer object`
        + ` '${layerObjectName}' doesn't have a 'polygon' property`);
    }

    shape.push(object.polygon);
  }

  if (shape.length === 0)
  {
    throw new Error(`Failed to get physics shape from tilemap`
      + ` '${tilemapName}' because tile with gid '${tileGid}'`
      + ` corresponding to layer object '${layerObjectName}'`
      + ` doesn't have any polygons in it. You probably`
      + ` forgot to edit it's physic shape in Tiled editor`);
  }

  return shape;
}

// ! Throws exception on error.
function getTile
(
  data: Shared.Tilemap.Data,
  tileGid: number,
  tilemapName: string
)
{
  if (data.tilesMap === undefined)
  {
    throw new Error(`Tilemap '${tilemapName}' doesn't have`
      + ` a 'tilesMap' property. It needs to be initialized`
      + ` after loading`);
  }

  const tile = data.tilesMap.get(tileGid);

  if (tile === undefined)
  {
    throw new Error(`Tilemap ${tilemapName} doesn't have tile`
      + ` with gid '${tileGid}'`);
  }

  return tile;
}