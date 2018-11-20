/*
  Shared abstract ancestor of Tilemap classes.
*/

import { Physics } from "../../Shared/Physics/Physics";

export abstract class Tilemap
{
   constructor(protected readonly name: string) { }
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