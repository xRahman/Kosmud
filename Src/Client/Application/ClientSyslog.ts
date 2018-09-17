/*
  Part of BrutusNEXT

  Implements client-side logger.

  Do not use it directly, use /shared/lib/log/Syslog instead.
*/

'use strict';

///import {Application} from '../../Shared/Application';
import {MessageType} from '../../Shared/MessageType';

export class ClientSyslog
{
  // Outputs log message to log file.
  public static log(message: string, msgType: MessageType)
  {
    let entry = "[" + MessageType[msgType] + "] " + message;

    // Output to debug console.
    console.log(entry);
  }
}