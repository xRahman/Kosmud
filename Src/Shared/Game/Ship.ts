/*
  Part of Kosmud

  TEST - shared Ship class ancestor.
*/

import { Vector } from "Shared/Physics/Vector";

export class Ship
{
  constructor(protected position: Vector, protected angle: number) {}
}