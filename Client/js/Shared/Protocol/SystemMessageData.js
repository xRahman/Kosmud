/*
  Part of Kosmud

  Part of client-server communication protocol.

  System message.
*/
define(["require", "exports", "../../Shared/Class/Classes", "../../Shared/Class/Serializable"], function (require, exports, Classes_1, Serializable_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
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
});
//# sourceMappingURL=SystemMessageData.js.map