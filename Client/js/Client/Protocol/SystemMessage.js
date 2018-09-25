/*
  Part of Kosmud

  Outgoing system message packet.
*/
define(["require", "exports", "../../Shared/Class/Classes", "../../Shared/Protocol/OutgoingPacket"], function (require, exports, Classes_1, OutgoingPacket_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    class SystemMessage extends OutgoingPacket_1.OutgoingPacket {
        constructor(data) {
            super();
            this.data = data;
            this.version = 0;
        }
    }
    exports.SystemMessage = SystemMessage;
    Classes_1.Classes.registerSerializableClass(SystemMessage);
});
//# sourceMappingURL=SystemMessage.js.map