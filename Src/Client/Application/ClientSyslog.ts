/*
  Part of BrutusNEXT

  Client-side logger.
*/

'use strict';

import {MessageType} from '../../Shared/MessageType';

export class ClientSyslog
{
  public static log(message: string, msgType: MessageType)
  {
    let entry = "[" + MessageType[msgType] + "] " + message;

    // Output to debug console.
    console.log(entry);
  }
}