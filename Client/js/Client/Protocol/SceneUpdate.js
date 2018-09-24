/*
  Part of BrutusNEXT

  Client-side version of system message packet.
*/
define(["require", "exports", "../../Shared/Class/Classes", "../../Shared/Protocol/SharedSceneUpdate"], function (require, exports, Classes_1, SharedSceneUpdate_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    class SceneUpdate extends SharedSceneUpdate_1.SharedSceneUpdate {
        constructor() {
            super();
            this.version = 0;
        }
    }
    exports.SceneUpdate = SceneUpdate;
    Classes_1.Classes.registerSerializableClass(SceneUpdate);
});
//# sourceMappingURL=SceneUpdate.js.map