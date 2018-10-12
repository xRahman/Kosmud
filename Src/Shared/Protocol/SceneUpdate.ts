/*
  Part of Kosmud

  Part of client-server communication protocol.

  Description of change of scene contents which is sent to client.
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

  // ----------------- Public data ----------------------

}

// ------------------ Type declarations ----------------------

// Module is exported so you can use enum type from outside this file.
// It must be declared after the class because Typescript says so...
// export module SceneUpdate
// {
// }