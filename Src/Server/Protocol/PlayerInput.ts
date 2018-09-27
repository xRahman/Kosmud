/*
  Part of Kosmud

  Incoming player input packet.
*/

'use strict';

import {Connection} from '../../Server/Net/Connection';
import * as Shared from '../../Shared/Protocol/PlayerInput';

export class PlayerInput extends Shared.PlayerInput
{
  constructor
  (
    protected action: Shared.PlayerInput.Action,
    protected startOrStop: Shared.PlayerInput.StartOrStop
  )
  {
    super(action, startOrStop);

    this.version = 0;
  }

  // ---------------- Public methods --------------------

  // ~ Overrides Packet.process().
  public async process(connection: Connection)
  {
    console.log('PlayerInput.process()');

    /// TODO
    console.log(this);
  }

  // --------------- Private methods --------------------
}