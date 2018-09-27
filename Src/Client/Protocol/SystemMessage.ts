/*
  Part of Kosmud

  Outgoing system message packet.
*/

'use strict';

import {Classes} from '../../Shared/Class/Classes';
import {OutgoingPacket} from '../../Shared/Protocol/OutgoingPacket';
import {SystemMessageInterface} from '../../Shared/Protocol/SystemMessageData';
import {SystemMessageData} from '../../Shared/Protocol/SystemMessageData';

export class SystemMessage
  extends OutgoingPacket
  implements SystemMessageInterface
{
  constructor(public data: SystemMessageData)
  {
    super();

    this.version = 0;
  }
}

Classes.registerSerializableClass(SystemMessage);