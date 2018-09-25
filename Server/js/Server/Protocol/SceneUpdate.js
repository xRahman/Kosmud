/*
  Part of BrutusNEXT

  Outgoing scene update packet.
*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const OutgoingPacket_1 = require("../../Shared/Protocol/OutgoingPacket");
const Classes_1 = require("../../Shared/Class/Classes");
class SceneUpdate extends OutgoingPacket_1.OutgoingPacket {
    constructor(data) {
        super();
        this.data = data;
        this.version = 0;
    }
}
exports.SceneUpdate = SceneUpdate;
Classes_1.Classes.registerSerializableClass(SceneUpdate);
//# sourceMappingURL=SceneUpdate.js.map