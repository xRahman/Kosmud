/*
  Part of Kosmud

  Part of client-server communication protocol.

  System message sent by client.
*/

import {MessageType} from '../../Shared/MessageType';
import {Packet} from '../../Shared/Protocol/Packet';

export class SystemMessage extends Packet
{
  constructor
  (
    protected message: string,
    protected messageType: MessageType
  )
  {
    super();

    this.version = 0;
  }
}
