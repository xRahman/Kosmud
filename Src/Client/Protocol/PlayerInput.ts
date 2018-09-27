/*
  Part of BrutusNEXT

  Client-side version of system message packet.
*/

import {Classes} from '../../Shared/Class/Classes';
import {OutgoingPacket} from '../../Shared/Protocol/OutgoingPacket';
import {PlayerInputInterface} from '../../Shared/Protocol/PlayerInputData';
import {PlayerInputData} from '../../Shared/Protocol/PlayerInputData';

export class PlayerInput
  extends OutgoingPacket
  implements PlayerInputInterface
{
  constructor(public data: PlayerInputData)
  {
    super();

    this.version = 0;
  }
}

Classes.registerSerializableClass(PlayerInput);