/*
  Part of BrutusNEXT

  Server-side logger.
*/
define(["require", "exports", "../../Shared/MessageType"], function (require, exports, MessageType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ServerSyslog {
        // Outputs message to log file. Also sends it to online immortals
        // of required or greater level.
        static log(text, msgType) {
            let entry = "[" + MessageType_1.MessageType[msgType] + "] " + text;
            // Output to stdout.
            console.log(entry);
            // Output to log file.
            /// TODO
        }
    }
    exports.ServerSyslog = ServerSyslog;
});
//# sourceMappingURL=ServerSyslog.js.map