/*
  Part of Kosmud

  Incoming mouse input packet.

  (Part of client-server communication protocol.)
*/

import {Connection} from '../../Server/Net/Connection';
import {Game} from '../../Server/Game/Game';
import * as Shared from '../../Shared/Protocol/MouseInput';

export class MouseInput extends Shared.MouseInput
{
  constructor(x: number, y: number)
  {
    super(x, y);

    this.version = 0;
  }

  // ---------------- Public methods --------------------

  // ~ Overrides Packet.process().
  public async process(connection: Connection)
  {
    Game.ship.seekPosition({ x: this.x, y: this.y });
  }
}

// This class is registered in Server/Net/Connection.