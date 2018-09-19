/*
  Part of BrutusNEXT

  Server-side logger.
*/

import {MessageType} from '../../Shared/MessageType';

export class ServerSyslog
{
  // Outputs message to log file. Also sends it to online immortals
  // of required or greater level.
  public static log(text: string, msgType: MessageType)
  {
    let entry = "[" + MessageType[msgType] + "] " + text;

    // Output to stdout.
    console.log(entry);

    // TODO: Output to log file.
  }
}