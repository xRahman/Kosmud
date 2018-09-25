/*
  Part of BrutusNEXT

  Client-side version of system message packet.
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "../../Shared/Class/Classes", "../../Shared/Protocol/IncomingPacket"], function (require, exports, Classes_1, IncomingPacket_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    class SceneUpdate extends IncomingPacket_1.IncomingPacket {
        constructor(data) {
            super();
            this.data = data;
            this.version = 0;
        }
        // ---------------- Public methods --------------------
        // ~ Overrides IncomingPacket.process().
        process(connection) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log('PlayerInput.process()');
                /// TODO
            });
        }
    }
    exports.SceneUpdate = SceneUpdate;
    Classes_1.Classes.registerSerializableClass(SceneUpdate);
});
//# sourceMappingURL=SceneUpdate.js.map