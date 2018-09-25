/*
  Part of BrutusNEXT

  Client-side version of system message packet.
*/
define(["require", "exports", "../../Shared/Class/Classes", "../../Shared/Protocol/OutgoingPacket"], function (require, exports, Classes_1, OutgoingPacket_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PlayerInput extends OutgoingPacket_1.OutgoingPacket {
        constructor(data) {
            super();
            this.data = data;
            this.version = 0;
        }
    }
    exports.PlayerInput = PlayerInput;
    Classes_1.Classes.registerSerializableClass(PlayerInput);
});
//# sourceMappingURL=PlayerInput.js.map