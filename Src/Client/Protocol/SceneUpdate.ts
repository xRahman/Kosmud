/*
  Part of BrutusNEXT

  Client-side version of system message packet.
*/

'use strict';

import {Classes} from '../../Shared/Class/Classes';
import {Connection} from '../../Client/Net/Connection';
import {IncomingPacket} from '../../Shared/Protocol/IncomingPacket';
import {SceneUpdateData} from '../../Shared/Protocol/SceneUpdateData';

export class SceneUpdate extends IncomingPacket
{
  constructor(public data: SceneUpdateData)
  {
    super();

    this.version = 0;
  }

  // ---------------- Public methods --------------------

  // ~ Overrides IncomingPacket.process().
  public async process(connection: Connection)
  {
    console.log('PlayerInput.process()');

    /// TODO
  }
}

Classes.registerSerializableClass(SceneUpdate);