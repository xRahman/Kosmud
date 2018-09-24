/*
  Part of BrutusNEXT

  Part of client-server communication protocol.
  Abstract ancestor of data packet classes.
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "../../Shared/ERROR", "../../Shared/Class/Serializable"], function (require, exports, ERROR_1, Serializable_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    class Packet extends Serializable_1.Serializable {
        process(connection) {
            return __awaiter(this, void 0, void 0, function* () {
                ERROR_1.ERROR("Attempt to process() a packet which is"
                    + " not supposed to be processed");
            });
        }
    }
    exports.Packet = Packet;
});
//# sourceMappingURL=Packet.js.map