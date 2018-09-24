/*
  Part of BrutusNEXT

  Server-side functionality related to system message packet.
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
const SharedPlayerInput_1 = require("../../Shared/Protocol/SharedPlayerInput");
const Classes_1 = require("../../Shared/Class/Classes");
class PlayerInput extends SharedPlayerInput_1.SharedPlayerInput {
    constructor() {
        super();
        this.version = 0;
    }
    // ---------------- Public methods --------------------
    // ~ Overrides Packet.process().
    process(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('PlayerInput.process()');
            // switch (this.type)
            // {
            //   case SystemMessage.Type.UNDEFINED:
            //     ERROR("Received system message with unspecified type."
            //       + " Someone problably forgot to set 'packet.type'"
            //       + " when sending system message from the client");
            //     break;
            //   case SystemMessage.Type.CLIENT_CLOSED_BROWSER_TAB:
            //     this.reportClientClosedBrowserTab(connection);
            //     break;
            //   default:
            //     ERROR("Received system message of unknown type.");
            //     break;
            // }
        });
    }
}
exports.PlayerInput = PlayerInput;
Classes_1.Classes.registerSerializableClass(PlayerInput);
//# sourceMappingURL=PlayerInput.js.map