/*
  Part of Kosmud

  Incoming system message packet.
*/

import {Syslog} from '../../Shared/Log/Syslog';
import * as Shared from '../../Shared/Protocol/SystemMessage';
import {Connection} from '../../Server/Net/Connection';

export class SystemMessage extends Shared.SystemMessage
{
  constructor(message: string, messageType: Syslog.MessageType)
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
      case "[CONNECTION_INFO]":
        Syslog.log
        (
          this.messageType,
          "User " + connection.getUserInfo() + " " + this.message
        );
        break;

      default:
        Syslog.log(this.messageType, this.message);
        break;
    }
  }
}

// This class is registered in Connection.