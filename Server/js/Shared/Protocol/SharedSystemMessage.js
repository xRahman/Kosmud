/*
  Part of BrutusNEXT

  Part of client-server communication protocol.

  System message.
*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const Packet_1 = require("../../Shared/Protocol/Packet");
class SharedSystemMessage extends Packet_1.Packet {
    constructor() {
        super();
        // ----------------- Public data ----------------------
        this.type = SharedSystemMessage.Type.UNDEFINED;
        this.message = null;
        this.version = 0;
    }
}
exports.SharedSystemMessage = SharedSystemMessage;
// ------------------ Type declarations ----------------------
// Module is exported so you can use enum type from outside this file.
// It must be declared after the class because Typescript says so...
(function (SharedSystemMessage) {
    let Type;
    (function (Type) {
        Type[Type["UNDEFINED"] = 0] = "UNDEFINED";
        Type[Type["CLIENT_CLOSED_BROWSER_TAB"] = 1] = "CLIENT_CLOSED_BROWSER_TAB";
    })(Type = SharedSystemMessage.Type || (SharedSystemMessage.Type = {}));
})(SharedSystemMessage = exports.SharedSystemMessage || (exports.SharedSystemMessage = {}));
//# sourceMappingURL=SharedSystemMessage.js.map