/*
  Part of BrutusNEXT

  Outgoing scene update packet.
*/
define(["require", "exports", "../../Shared/Protocol/OutgoingPacket", "../../Shared/Class/Classes"], function (require, exports, OutgoingPacket_1, Classes_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    class SceneUpdate extends OutgoingPacket_1.OutgoingPacket {
        constructor(data) {
            super();
            this.data = data;
            this.version = 0;
        }
    }
    exports.SceneUpdate = SceneUpdate;
    Classes_1.Classes.registerSerializableClass(SceneUpdate);
});
//# sourceMappingURL=SceneUpdate.js.map