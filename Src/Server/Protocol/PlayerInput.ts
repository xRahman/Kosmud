/*
  Part of Kosmud

  Incoming player input packet.
*/

'use strict';

import {Connection} from '../../Server/Net/Connection';
import * as Shared from '../../Shared/Protocol/PlayerInput';

export class PlayerInput extends Shared.PlayerInput
{
  constructor(type: Shared.PlayerInput.Type)
  {
    super(type);

    this.version = 0;
  }

  // ---------------- Public methods --------------------

  // ~ Overrides Packet.process().
  public async process(connection: Connection)
  {
    console.log('PlayerInput.process()');

    /// TODO
  }

  // --------------- Private methods --------------------
}