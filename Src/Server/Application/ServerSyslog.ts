/*
  Part of BrutusNEXT

  Implements server-side logger.

  Do not use it directly, use /shared/lib/log/Syslog instead.
*/

/// TODO: Az bude log file, tak napsat odchytavani vyjimek, aby se stack trace
///       zapisoval do log filu.

import {Application} from '../../Shared/Application';
import {MessageType} from '../../Shared/MessageType';
//import {Message} from '../../../server/lib/message/Message';

export class ServerSyslog
{
  // Outputs message to log file. Also sends it to online immortals
  // of required or greater level.
  public static log(text: string, msgType: MessageType)
  {
    let entry = "[" + MessageType[msgType] + "] " + text;

    // let message = new Message(entry, msgType);

    // // Send log entry to all online characters that have appropriate
    // // admin level. Syslog messages don't have sender ('sender'
    // // parameter is null).
    // message.sendToAllIngameConnections(adminLevel);

    // Output to stdout.
    console.log(entry);

    // Output to log file.
    /// TODO
  }
}