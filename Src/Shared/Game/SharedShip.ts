/*
  Part of BrutusNEXT

  TEST - shared Ship class ancestor.
*/

import {GameEntity} from '../../Shared/Game/GameEntity';

export class SharedShip
{
  constructor(protected position: GameEntity.Position) {}
}