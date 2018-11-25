/*
  Part of Kosmud

  Shared Ship class ancestor.
*/

import { Zone } from "../../Shared/Game/Zone";
import { Vehicle } from "../../Shared/Physics/Vehicle";

export class Ship extends Vehicle
{
  protected readonly tilemapName = Zone.BASIC_SHIPS_TILEMAP_ID;

  protected readonly engineSoundId = "Ship Engine Sound";
}