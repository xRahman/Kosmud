/*
  Shared abstract ancestor of Tilemap classes.
*/

import { Coords } from "../../Shared/Engine/Coords";
import { Physics } from "../../Shared/Physics/Physics";

export class Tilemap
{
  // private data: Tilemap.Data | "Not loaded" = "Not loaded";
  private readonly data: Tilemap.Data;

  // ! Throws exception on error.
  constructor
  (
    private readonly name: string,
    tilemapJsonData: object
  )
  {
    // This typecast is definitely not safe - we assume that
    // we got a json data in correct format but there is no
    // gurantee. However, parsing the data correcly would
    // take a lot of work and any error would lead to an
    // exception which we will get anyways when accessing
    // nonexisting property or something like that.
    this.data = (tilemapJsonData as Tilemap.Data);

    // ! Throws exception on error.
    indexData(this.data, this.getName());
  }

  // --------------- Public methods ---------------------

  public getName() { return this.name; }

  // ! Throws exception on error.
  public getShape(objectLayerName: string, objectName: string)
  {
    // ! Throws exception on error.
    const hullTileGid = getHullTileGid
    (
      this.data, objectLayerName, objectName, this.getName()
    );

    // ! Throws exception on error.
    return getTileShape(this.data, hullTileGid, objectName, this.getName());
  }
}

// ----------------- Auxiliary Functions ---------------------

// ! Throws exception on error.
function indexData(data: Tilemap.Data, tilemapName: string)
{
  // ! Throws exception on error.
  indexLayers(data, tilemapName);

  // ! Throws exception on error.
  indexTiles(data, tilemapName);
}

// ! Throws exception on error.
function indexLayers(data: Tilemap.Data, tilemapName: string)
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
function indexLayer(layer: Tilemap.Layer, tilemapName: string)
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
function indexTiles(data: Tilemap.Data, tilemapName: string)
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
  tileset: Tilemap.Tileset,
  tilesMap: Map<number, Tilemap.Tile>
)
{
  for (const tile of tileset.tiles)
  {
    tilesMap.set(tile.id + tileset.firstgid, tile);
  }
}

function getLayer
(
  data: Tilemap.Data,
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
  layer: Tilemap.Layer,
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
  data: Tilemap.Data,
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
  data: Tilemap.Data,
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
    // ! Throws exception on error.
    const polygon = getPolygon
    (
      object,
      tileGid,
      data.tilewidth,
      data.tileheight,
      layerObjectName,
      tilemapName
    );

    shape.push(polygon);
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
function getPolygon
(
  object: Tilemap.TilemapObject,
  tileGid: number,
  tileWidth: number,
  tileHeight: number,
  layerObjectName: string,
  tilemapName: string
)
{
  if (object.polygon === undefined)
  {
    throw new Error(`Failed to get physics shape from tilemap`
      + ` '${tilemapName}' because object '${object.name}' in`
      + ` tile with gid '${tileGid}' corresponding to layer object`
      + ` '${layerObjectName}' doesn't have a 'polygon' property`);
  }

  // Polygons are saved at [0, 0] in tilemap data so we
  // need to translate them by [object.x, object.y].
  let offset = { x: object.x, y: object.y };

  // We also need to translate to the middle of the tile,
  // because Tiled tiles have their origin at top left but
  // sprites in Phaser have their origin in the midle.
  offset = Coords.ClientToServer.tileObject
  (
    offset, tileWidth, tileHeight
  );

  const polygon: Physics.Polygon = [];

  for (const point of object.polygon)
  {
    polygon.push
    (
      Coords.ClientToServer.vector
      (
        {
          x: (point.x + offset.x),
          y: (point.y + offset.y)
        }
      )
    );
  }

  return polygon;
}

// ! Throws exception on error.
function getTile
(
  data: Tilemap.Data,
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

// ------------------ Type Declarations ----------------------

export namespace Tilemap
{
  export interface TilemapObject
  {
    gid?: number;
    height: number;
    id: number;
    name: string;
    polygon?: Physics.Polygon;
    rotation: number;         // 'rotation' is in degrees.
    type: string;
    visible: boolean;
    width: number;
    x: number;
    y: number;
  }

  export interface Layer
  {
    draworder: string;        // "topdown"
    id: number;
    name: string;
    objects: Array<TilemapObject>;
    // This property is not part of data format, it is set after loading.
    objectsMap: Map<string, Array<TilemapObject>>;  // Indexed by object name.
    opacity: number;
    type: string;             // "objectgroup"
    visible: boolean;
    x: number;
    y: number;
  }

  export interface ObjectGroup
  {
    draworder: string;          // "index"
    name: string;
    objects: Array<TilemapObject>;
    opacity: number;            // 0 to 1.
    type: string;               // "objectgroup"
    visible: boolean;
    x: number;
    y: number;
  }

  export interface AnimationFrame
  {
    "duration": number;         // In miliseconds.
    "tileid": number;
  }

  export interface Tile
  {
    id: number;
    objectgroup?: ObjectGroup;
    animation?: Array<AnimationFrame>;
  }

  export interface Tileset
  {
    columns: number;
    firstgid: number;
    image: string;            // Relative path.
    imageheight: number;
    imagewidth: number;
    margin: number;
    name: string;
    spacing: number;
    tilecount: number;
    tileheight: number;
    tiles: Array<Tile>;
    tilewidth: number;
  }

  export interface Data
  {
    height: number;
    infinite: boolean;
    layers: Array<Layer>;
    layersMap?: Map<string, Layer>;
    nextlayerid: number;
    nextobjectid: number;
    orientation: string;      // "orthogonal"
    renderorder: string;      // "right-down"
    tiledversion: string;     // "1.2.1"
    tileheight: number;
    tilesets: Array<Tileset>;
    // This property is not part of data format, it is set after loading.
    tilesMap?: Map<number, Tile>; // Indexed by 'gid' (global tilemap id).
    tilewidth: number;
    type: string;             // "map"
    version: number;          // 1.2;
    width: number;
  }
}