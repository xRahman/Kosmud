/*
  Part of BrutusNEXT

  Client-side logger.
*/
define(["require", "exports", "../../Shared/MessageType"], function (require, exports, MessageType_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    class ClientSyslog {
        static log(message, msgType) {
            let entry = "[" + MessageType_1.MessageType[msgType] + "] " + message;
            // Output to debug console.
            console.log(entry);
        }
    }
    exports.ClientSyslog = ClientSyslog;
});
//# sourceMappingURL=ClientSyslog.js.map