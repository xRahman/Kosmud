/*
  Part of Kosmud

  Shared Ship class ancestor.
*/

// import { Vector } from "../../Shared/Physics/Vector";
import { Vehicle } from "../../Shared/Physics/Vehicle";

export class Ship extends Vehicle
{
  protected static readonly TILEMAP_NAME = "Basic ships Tilemap";
  protected static readonly TILEMAP_PATH =
    "./Client/Tilemaps/Ships/basic_ships.json";

  // constructor(protected position: Vector, protected rotation: number)
  // {
  //   super();
  // }
}