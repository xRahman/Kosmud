"use strict";
/*
  Part of BrutusNEXT

  Implements server-side logger.

  Do not use it directly, use /shared/lib/log/Syslog instead.
*/
Object.defineProperty(exports, "__esModule", { value: true });
const MessageType_1 = require("../../Shared/MessageType");
//import {Message} from '../../../server/lib/message/Message';
class ServerSyslog {
    // Outputs message to log file. Also sends it to online immortals
    // of required or greater level.
    static log(text, msgType) {
        let entry = "[" + MessageType_1.MessageType[msgType] + "] " + text;
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
exports.ServerSyslog = ServerSyslog;
//# sourceMappingURL=ServerSyslog.js.map