/*
  Part of BrutusNEXT

  Server-side functionality related to system message packet.
*/

'use strict';

// import {ERROR} from '../../Shared/ERROR';
// import {Syslog} from '../../Shared/Syslog';
// import {MessageType} from '../../Shared/MessageType';
import {Connection} from '../../Server/Net/Connection';
import {SharedPlayerInput} from '../../Shared/Protocol/SharedPlayerInput';
import {Classes} from '../../Shared/Class/Classes';

export class PlayerInput extends SharedPlayerInput
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
    console.log('PlayerInput.process()');

    // switch (this.type)
    // {
    //   case SystemMessage.Type.UNDEFINED:
    //     ERROR("Received system message with unspecified type."
    //       + " Someone problably forgot to set 'packet.type'"
    //       + " when sending system message from the client");
    //     break;

    //   case SystemMessage.Type.CLIENT_CLOSED_BROWSER_TAB:
    //     this.reportClientClosedBrowserTab(connection);
    //     break;

    //   default:
    //     ERROR("Received system message of unknown type.");
    //     break;
    // }
  }

  // --------------- Private methods --------------------
}

Classes.registerSerializableClass(PlayerInput);