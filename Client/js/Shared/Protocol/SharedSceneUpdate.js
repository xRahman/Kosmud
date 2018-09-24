/*
  Part of BrutusNEXT

  Part of client-server communication protocol.

  Description of change of scene contents which is sent to client.
*/
define(["require", "exports", "../../Shared/Protocol/Packet"], function (require, exports, Packet_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    class SharedSceneUpdate extends Packet_1.Packet {
        constructor() {
            super();
            this.version = 0;
        }
    }
    exports.SharedSceneUpdate = SharedSceneUpdate;
});
// ------------------ Type declarations ----------------------
// Module is exported so you can use enum type from outside this file.
// It must be declared after the class because Typescript says so...
// export module SharedSystemMessage
// {
// }
//# sourceMappingURL=SharedSceneUpdate.js.map