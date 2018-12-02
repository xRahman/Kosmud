/*
  Part of Kosmud

  Shared Ship class ancestor.
*/

import { Zone } from "../../Shared/Game/Zone";
import { Vehicle } from "../../Shared/Game/Vehicle";

export class Ship extends Vehicle
{
  protected readonly tilemapId = Zone.BASIC_SHIPS_TILEMAP_ID;
  protected readonly exhaustSoundId = "Ship Engine Sound";
  protected readonly physicsShapeId = Zone.FIGHTER_SHAPE_ID;
}