/*
  Part of Kosmud

  Part of client-server communication protocol.

  Description of change of scene contents which is sent to client.
*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const Classes_1 = require("../../Shared/Class/Classes");
const Serializable_1 = require("../../Shared/Class/Serializable");
class SceneUpdateData extends Serializable_1.Serializable {
    constructor() {
        super();
        this.version = 0;
    }
}
exports.SceneUpdateData = SceneUpdateData;
Classes_1.Classes.registerSerializableClass(SceneUpdateData);
//# sourceMappingURL=SceneUpdateData.js.map