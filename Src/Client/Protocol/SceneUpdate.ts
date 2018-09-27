/*
  Part of BrutusNEXT

  Client-side version of system message packet.
*/

'use strict';

import {Classes} from '../../Shared/Class/Classes';
import {Connection} from '../../Client/Net/Connection';
import {GameEntity} from '../../Shared/Game/GameEntity';
import * as Shared from '../../Shared/Protocol/SceneUpdate';

export class SceneUpdate extends Shared.SceneUpdate
{
  constructor(shipPosition: GameEntity.Position)
  {
    super(shipPosition);

    this.version = 0;
  }

  // ---------------- Public methods --------------------

  // ~ Overrides Packet.process().
  public async process(connection: Connection)
  {
    console.log('SceneUpdate.process()');

    /// TODO
    console.log(this);
  }
}

Classes.registerSerializableClass(SceneUpdate);