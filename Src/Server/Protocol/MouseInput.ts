/*
  Part of Kosmud

  Incoming mouse input packet.

  (Part of client-server communication protocol.)
*/

import {Vector} from '../../Shared/Physics/Vector';
import {Connection} from '../../Server/Net/Connection';
import {Game} from '../../Server/Game/Game';
import * as Shared from '../../Shared/Protocol/MouseInput';

export class MouseInput extends Shared.MouseInput
{
  // ---------------- Public methods --------------------

  // ~ Overrides Packet.process().
  public async process(connection: Connection)
  {
    Game.ship.seekPosition(this.mousePosition);
  }
}

// This class is registered in Server/Net/Connection.