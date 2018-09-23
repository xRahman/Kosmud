/*
  Part of BrutusNEXT

  Client-side version of system message packet.
*/
define(["require", "exports", "../../Shared/Class/Classes", "../../Shared/Protocol/SharedSystemMessage"], function (require, exports, Classes_1, SharedSystemMessage_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    class SystemMessage extends SharedSystemMessage_1.SharedSystemMessage {
        constructor() {
            super();
            this.version = 0;
        }
    }
    exports.SystemMessage = SystemMessage;
    Classes_1.Classes.registerSerializableClass(SystemMessage);
});
//# sourceMappingURL=SystemMessage.js.map