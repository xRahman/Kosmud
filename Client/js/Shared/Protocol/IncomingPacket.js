/*
  Part of Kosmud

  Part of client-server communication protocol.
  Abstract ancestor of incoming data packet classes.
*/
define(["require", "exports", "../../Shared/Class/Serializable"], function (require, exports, Serializable_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class IncomingPacket extends Serializable_1.Serializable {
    }
    exports.IncomingPacket = IncomingPacket;
});
//# sourceMappingURL=IncomingPacket.js.map