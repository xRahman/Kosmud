/*  Part of Kosmud  */

// import { Attributes } from "../../Shared/Class/Attributes";
// import { TilemapDescriptor } from "../../Shared/Asset/TilemapDescriptor";
// import { Physics } from "../../Shared/Physics/Physics";
import { AssetDescriptor } from "../../Shared/Asset/AssetDescriptor";

export class ShapeDescriptor extends AssetDescriptor
{
  protected static version = 0;

  public objectLayerName = "<missing object layer name>";
  public objectName = "<missing object name>";

  // private tilemapAsset: TilemapDescriptor | "Not set" = "Not set";

  // private shape: Physics.Shape | "Not set" = "Not set";
  // private static readonly shape: Attributes =
  // {
  //   saved: false,
  //   sentToClient: false
  // };

  // ---------------- Public methods --------------------

// // ! Throws exception on error.
// public setTilemapDescriptor(tilemapAsset: TilemapDescriptor)
// {
//  if (this.hasOwnProperty("tilemapAsset") && this.tilemapAsset !== "Not set")
//   {
//     throw Error(`Shape asset ${this.debugId} already has a tilemap asset`);
//   }

//   this.tilemapAsset = tilemapAsset;
// }

// // ! Throws exception on error.
// public getTilemapDescriptor()
// {
//   if (this.tilemapAsset === "Not set")
//   {
//     throw Error(`Shape asset  ${this.debugId} doesn't have`
//       + ` tilemap asset reference`);
//   }

//   return this.tilemapAsset;
// }

  // // ! Throws exception on error.
  // public setShape(shape: Physics.Shape)
  // {
  //   if (this.hasOwnProperty("shape") && this.shape !== "Not set")
  //   {
  //     throw Error(`Shape asset ${this.debugId} already has physics`
  //       + ` shape reference`);
  //   }

  //   this.shape = shape;
  // }

  // // ! Throws exception on error.
  // public getShape()
  // {
  //   if (this.shape === "Not set")
  //   {
  //     throw Error(`Shape asset ${this.debugId} doesn't have`
  //       + ` physics shape initialized`);
  //   }

  //   return this.shape;
  // }
}