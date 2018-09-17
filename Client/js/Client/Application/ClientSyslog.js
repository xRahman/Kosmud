/*
  Part of BrutusNEXT

  Implements client-side logger.

  Do not use it directly, use /shared/lib/log/Syslog instead.
*/
define(["require", "exports", "../../Shared/MessageType"], function (require, exports, MessageType_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    class ClientSyslog {
        // Outputs log message to log file.
        static log(message, msgType) {
            let entry = "[" + MessageType_1.MessageType[msgType] + "] " + message;
            // Output to debug console.
            console.log(entry);
        }
    }
    exports.ClientSyslog = ClientSyslog;
});
//# sourceMappingURL=ClientSyslog.js.map