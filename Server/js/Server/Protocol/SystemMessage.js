/*
  Part of Kosmud

  Incoming system message packet.
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
const Syslog_1 = require("../../Shared/Syslog");
const Utils_1 = require("../../Shared/Utils");
const MessageType_1 = require("../../Shared/MessageType");
const IncomingPacket_1 = require("../../Shared/Protocol/IncomingPacket");
const Classes_1 = require("../../Shared/Class/Classes");
class SystemMessage extends IncomingPacket_1.IncomingPacket {
    constructor(data) {
        super();
        this.data = data;
        this.version = 0;
    }
    // ---------------- Public methods --------------------
    // ~ Overrides IncomingPacket.process().
    process(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('SystemMessage.process()');
            switch (this.data.type) {
                case "Client closed browser tab":
                    reportClientClosedBrowserTab(connection);
                    break;
                default:
                    Utils_1.Utils.reportMissingCase(this.data.type);
            }
        });
    }
}
exports.SystemMessage = SystemMessage;
Classes_1.Classes.registerSerializableClass(SystemMessage);
// ----------------- Auxiliary Functions ---------------------
function reportClientClosedBrowserTab(connection) {
    Syslog_1.Syslog.log(connection.getUserInfo() + " has disconnected by"
        + " closing or reloading browser tab", MessageType_1.MessageType.CONNECTION_INFO);
}
//# sourceMappingURL=SystemMessage.js.map