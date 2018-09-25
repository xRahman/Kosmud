/*
  Part of Kosmud

  Part of client-server communication protocol.

  Description of change of scene contents which is sent to client.
*/
define(["require", "exports", "../../Shared/Class/Classes", "../../Shared/Class/Serializable"], function (require, exports, Classes_1, Serializable_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    class SceneUpdateData extends Serializable_1.Serializable {
        constructor() {
            super();
            this.version = 0;
        }
    }
    exports.SceneUpdateData = SceneUpdateData;
    Classes_1.Classes.registerSerializableClass(SceneUpdateData);
});
// ------------------ Type declarations ----------------------
// Module is exported so you can use enum type from outside this file.
// It must be declared after the class because Typescript says so...
// export module SceneUpdateData
// {
// }
//# sourceMappingURL=SceneUpdateData.js.map