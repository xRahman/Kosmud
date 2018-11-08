/*
  Part of Kosmud

  TEST - shared Ship class ancestor.
*/

import { Vector } from "../../Shared/Physics/Vector";
import { Vehicle } from "../../Shared/Physics/Vehicle";

export class Ship
{
  constructor(protected position: Vector, protected rotation: number) {}
}