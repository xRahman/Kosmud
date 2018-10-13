/*
  Part of Kosmud

  Incoming system message packet.

  (Part of client-server communication protocol.)
*/

import {Syslog} from '../../Shared/Log/Syslog';
import {Connection} from '../../Server/Net/Connection';
import * as Shared from '../../Shared/Protocol/SystemMessage';

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

// This class is registered in Server/Net/Connection.