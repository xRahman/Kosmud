/*
  Part of Kosmud

  Part of client-server communication protocol.

  Information about player input activity (kepresses, mouse clicks etc.).
*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const Classes_1 = require("../../Shared/Class/Classes");
const Serializable_1 = require("../../Shared/Class/Serializable");
class PlayerInputData extends Serializable_1.Serializable {
    constructor(type = PlayerInputData.Type) {
        super();
        this.type = type;
        this.version = 0;
    }
}
exports.PlayerInputData = PlayerInputData;
Classes_1.Classes.registerSerializableClass(PlayerInputData);
// ------------------ Type declarations ----------------------
// Module is exported so you can use enum type from outside this file.
// It must be declared after the class because Typescript says so...
(function (PlayerInputData) {
    /// TODO: Tohle zatím provizorně.
    let Type;
    (function (Type) {
        Type[Type["KEY_DOWN"] = 0] = "KEY_DOWN";
        Type[Type["KEY_UP"] = 1] = "KEY_UP";
    })(Type = PlayerInputData.Type || (PlayerInputData.Type = {}));
})(PlayerInputData = exports.PlayerInputData || (exports.PlayerInputData = {}));
//# sourceMappingURL=PlayerInputData.js.map