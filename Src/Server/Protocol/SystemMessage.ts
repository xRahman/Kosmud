/*
  Part of Kosmud

  Incoming system message packet.
*/

'use strict';

import {Syslog} from '../../Shared/Syslog';
import {Classes} from '../../Shared/Class/Classes';
import {MessageType} from '../../Shared/MessageType';
import * as Shared from '../../Shared/Protocol/SystemMessage';
import {Connection} from '../../Server/Net/Connection';

export class SystemMessage extends Shared.SystemMessage
{
  constructor(message: string, messageType: MessageType)
  {
    super(message, messageType);

    this.version = 0;
  }

  // ---------------- Public methods --------------------

  // ~ Overrides Packet.process().
  public async process(connection: Connection)
  {
    console.log('SystemMessage.process()');

    Syslog.log(this.message, this.messageType);
  }
}