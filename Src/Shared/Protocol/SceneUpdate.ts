/*
  Part of Kosmud

  Description of change of scene contents.

  (Part of client-server communication protocol.)
*/

import {Packet} from '../../Shared/Protocol/Packet';
import {GameEntity} from '../../Shared/Game/GameEntity';

export class SceneUpdate extends Packet
{
  constructor(public shipPosition: GameEntity.Position)
  {
    super();

    this.version = 0;
  }
}
