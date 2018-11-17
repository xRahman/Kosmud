/*
  Server implementation of Tilemap.
*/

import { Physics } from "../../Shared/Physics/Physics";
import { JsonObject } from "../../Shared/Class/JsonObject";
import { FileSystem } from "../../Server/FileSystem/FileSystem";
import * as Shared from "../../Shared/Physics/Tilemap";

export class Tilemap extends Shared.Tilemap
{
  private data: Tilemap.Data | "Not loaded" = "Not loaded";

  constructor(jsonFilePath: string)
  {
    super();
  }

  // ---------------- Public methods --------------------

  // ! Throws exception on error.
  public async load(jsonFilePath: string)
  {
    // ! Throws exception on error.
    const jsonData = await FileSystem.readExistingFile(jsonFilePath);

    // ! Throws exception on error.
    this.data = (JsonObject.parse(jsonData) as Tilemap.Data);
  }

  // ---------------- Private methods -------------------
}

// ------------------ Type Declarations ----------------------

export namespace Tilemap
{
  interface TilemapObject
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

  interface Layer
  {
    draworder: string;        // "topdown"
    id: number;
    name: string;
    objects: Array<TilemapObject>;
    opacity: number;
    type: string;             // "objectgroup"
    visible: boolean;
    x: number;
    y: number;
  }

  interface ObjectGroup
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

  interface AnimationFrame
  {
    "duration": number;         // In miliseconds.
    "tileid": number;
  }

  interface Tile
  {
    id: number;
    objectgroup?: ObjectGroup;
    animation?: Array<AnimationFrame>;
  }

  interface Tileset
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
    nextlayerid: number;
    nextobjectid: number;
    orientation: string;      // "orthogonal"
    renderorder: string;      // "right-down"
    tiledversion: string;     // "1.2.1"
    tileheight: number;
    tilesets: Array<Tileset>;
    tilewidth: number;
    type: string;             // "map"
    version: number;          // 1.2;
    width: number;
  }
}