/*
  Part of Kosmud

  Incoming player input packet.
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
const Classes_1 = require("../../Shared/Class/Classes");
const IncomingPacket_1 = require("../../Shared/Protocol/IncomingPacket");
class PlayerInput extends IncomingPacket_1.IncomingPacket {
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
exports.PlayerInput = PlayerInput;
Classes_1.Classes.registerSerializableClass(PlayerInput);
//# sourceMappingURL=PlayerInput.js.map