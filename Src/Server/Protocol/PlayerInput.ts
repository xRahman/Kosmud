/*
  Part of Kosmud

  Incoming player input packet.
*/

'use strict';

import {Connection} from '../../Server/Net/Connection';
import {Classes} from '../../Shared/Class/Classes';
import {IncomingPacket} from '../../Shared/Protocol/IncomingPacket';
import {PlayerInputInterface} from '../../Shared/Protocol/PlayerInputData';
import {PlayerInputData} from '../../Shared/Protocol/PlayerInputData';

export class PlayerInput
  extends IncomingPacket
  implements PlayerInputInterface
{
  constructor(public data: PlayerInputData)
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

  // --------------- Private methods --------------------
}

Classes.registerSerializableClass(PlayerInput);