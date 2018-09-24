/*
  Part of BrutusNEXT

  Client-side version of system message packet.
*/
define(["require", "exports", "../../Shared/Class/Classes", "../../Shared/Protocol/SharedPlayerInput"], function (require, exports, Classes_1, SharedPlayerInput_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    class PlayerInput extends SharedPlayerInput_1.SharedPlayerInput {
        constructor() {
            super();
            this.version = 0;
        }
    }
    exports.PlayerInput = PlayerInput;
    Classes_1.Classes.registerSerializableClass(PlayerInput);
});
//# sourceMappingURL=PlayerInput.js.map