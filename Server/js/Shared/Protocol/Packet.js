/*
  Part of BrutusNEXT

  Part of client-server communication protocol.
  Abstract ancestor of data packet classes.
*/
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ERROR_1 = require("../../Shared/ERROR");
const Serializable_1 = require("../../Shared/Class/Serializable");
class Packet extends Serializable_1.Serializable {
    process(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            ERROR_1.ERROR("Attempt to process() a packet which is"
                + " not supposed to be processed");
        });
    }
}
exports.Packet = Packet;
//# sourceMappingURL=Packet.js.map