"use strict";
/*
  Part of BrutusNEXT

  Server-side logger.
*/
Object.defineProperty(exports, "__esModule", { value: true });
const MessageType_1 = require("../../Shared/MessageType");
class ServerSyslog {
    // Outputs message to log file. Also sends it to online immortals
    // of required or greater level.
    static log(text, msgType) {
        let entry = "[" + MessageType_1.MessageType[msgType] + "] " + text;
        // Output to stdout.
        console.log(entry);
        // TODO: Output to log file.
    }
}
exports.ServerSyslog = ServerSyslog;
//# sourceMappingURL=ServerSyslog.js.map