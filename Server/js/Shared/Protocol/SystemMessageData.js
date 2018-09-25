/*
  Part of Kosmud

  Part of client-server communication protocol.

  System message.
*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const Classes_1 = require("../../Shared/Class/Classes");
const Serializable_1 = require("../../Shared/Class/Serializable");
class SystemMessageData extends Serializable_1.Serializable {
    constructor(type, message) {
        super();
        this.type = type;
        this.message = message;
        this.version = 0;
    }
}
exports.SystemMessageData = SystemMessageData;
Classes_1.Classes.registerSerializableClass(SystemMessageData);
//# sourceMappingURL=SystemMessageData.js.map