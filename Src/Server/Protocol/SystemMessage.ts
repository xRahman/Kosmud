/*
  Part of Kosmud

  Incoming system message packet.
*/

'use strict';

import {Syslog} from '../../Shared/Syslog';
import {Utils} from '../../Shared/Utils';
import {MessageType} from '../../Shared/MessageType';
import {Connection} from '../../Server/Net/Connection';
import {IncomingPacket} from '../../Shared/Protocol/IncomingPacket';
import {SystemMessageInterface} from '../../Shared/Protocol/SystemMessageData';
import {SystemMessageData} from '../../Shared/Protocol/SystemMessageData';
import {Classes} from '../../Shared/Class/Classes';

export class SystemMessage
  extends IncomingPacket
  implements SystemMessageInterface
{
  constructor(public data: SystemMessageData)
  {
    super();

    this.version = 0;
  }

  // ---------------- Public methods --------------------

  // ~ Overrides IncomingPacket.process().
  public async process(connection: Connection)
  {
    console.log('SystemMessage.process()');

    switch (this.data.type)
    {
      case "Client closed browser tab":
        reportClientClosedBrowserTab(connection);
        break;

      default:
        Utils.reportMissingCase(this.data.type);
    }
  }
}

Classes.registerSerializableClass(SystemMessage);

// ----------------- Auxiliary Functions ---------------------

function reportClientClosedBrowserTab(connection: Connection)
{
  Syslog.log
  (
    connection.getUserInfo() + " has disconnected by"
      + " closing or reloading browser tab",
    MessageType.CONNECTION_INFO
  );
}