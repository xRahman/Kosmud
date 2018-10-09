/*
  Part of Kosmud

  Incoming system message packet.
*/

import {Syslog} from '../../Shared/Log/Syslog';
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
    switch (this.messageType)
    {
      case MessageType.CONNECTION_INFO:
        Syslog.log
        (
          "User " + connection.getUserInfo() + " " + this.message,
          this.messageType
        );
        break;

      default:
        Syslog.log(this.message, this.messageType);
        break;
    }
  }
}

// This class is registered in Connection.