/*
  Part of BrutusNEXT

  Part of client-server communication protocol.
  Abstract ancestor of data packet classes.
*/
define(["require", "exports", "../../Shared/ERROR", "../../Shared/Class/Serializable"], function (require, exports, ERROR_1, Serializable_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    class Packet extends Serializable_1.Serializable {
        async process(connection) {
            ERROR_1.ERROR("Attempt to process() a packet which is"
                + " not supposed to be processed");
        }
    }
    exports.Packet = Packet;
});
//# sourceMappingURL=Packet.js.map