/*
  Part of BrutusNEXT

  Part of client-server communication protocol.

  Player pressed something on the keyboard, clicked a mouse button etc.
*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const Packet_1 = require("../../Shared/Protocol/Packet");
class SharedPlayerInput extends Packet_1.Packet {
    constructor() {
        super();
        // ----------------- Public data ----------------------
        this.type = SharedPlayerInput.Type.UNDEFINED;
        this.version = 0;
    }
}
exports.SharedPlayerInput = SharedPlayerInput;
// ------------------ Type declarations ----------------------
// Module is exported so you can use enum type from outside this file.
// It must be declared after the class because Typescript says so...
(function (SharedPlayerInput) {
    /// TODO: Tohle zatím provizorně.
    let Type;
    (function (Type) {
        Type[Type["UNDEFINED"] = 0] = "UNDEFINED";
        Type[Type["KEY_DOWN"] = 1] = "KEY_DOWN";
        Type[Type["KEY_UP"] = 2] = "KEY_UP";
    })(Type = SharedPlayerInput.Type || (SharedPlayerInput.Type = {}));
})(SharedPlayerInput = exports.SharedPlayerInput || (exports.SharedPlayerInput = {}));
//# sourceMappingURL=SharedPlayerInput.js.map