/*
  Part of BrutusNEXT

  Server-side functionality related to system message packet.
*/

'use strict';

import {ERROR} from '../../Shared/ERROR';
import {Syslog} from '../../Shared/Syslog';
import {MessageType} from '../../Shared/MessageType';
import {Connection} from '../../Server/Net/Connection';
import {SharedSystemMessage} from '../../Shared/Protocol/SharedSystemMessage';
import {Classes} from '../../Shared/Class/Classes';

export class SystemMessage extends SharedSystemMessage
{
  constructor()
  {
    super();

    this.version = 0;
  }

  // ---------------- Public methods --------------------

  // ~ Overrides Packet.process().
  public async process(connection: Connection)
  {
    console.log('SystemMessage.process()');

    switch (this.type)
    {
      case SystemMessage.Type.UNDEFINED:
        ERROR("Received system message with unspecified type."
          + " Someone problably forgot to set 'packet.type'"
          + " when sending system message from the client");
        break;

      case SystemMessage.Type.CLIENT_CLOSED_BROWSER_TAB:
        this.reportClientClosedBrowserTab(connection);
        break;

      default:
        ERROR("Received system message of unknown type.");
        break;
    }
  }

  // --------------- Private methods --------------------

  private reportClientClosedBrowserTab(connection: Connection)
  {
    Syslog.log
    (
      connection.getUserInfo() + " has disconnected by"
        + " closing or reloading browser tab",
      MessageType.CONNECTION_INFO
    );
  }
}

Classes.registerSerializableClass(SystemMessage);