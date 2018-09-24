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
const ERROR_1 = require("../../Shared/ERROR");
const Syslog_1 = require("../../Shared/Syslog");
const MessageType_1 = require("../../Shared/MessageType");
const SharedSystemMessage_1 = require("../../Shared/Protocol/SharedSystemMessage");
const Classes_1 = require("../../Shared/Class/Classes");
class SystemMessage extends SharedSystemMessage_1.SharedSystemMessage {
    constructor() {
        super();
        this.version = 0;
    }
    // ---------------- Public methods --------------------
    // ~ Overrides Packet.process().
    process(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('SystemMessage.process()');
            switch (this.type) {
                case SystemMessage.Type.UNDEFINED:
                    ERROR_1.ERROR("Received system message with unspecified type."
                        + " Someone problably forgot to set 'packet.type'"
                        + " when sending system message from the client");
                    break;
                case SystemMessage.Type.CLIENT_CLOSED_BROWSER_TAB:
                    this.reportClientClosedBrowserTab(connection);
                    break;
                default:
                    ERROR_1.ERROR("Received system message of unknown type.");
                    break;
            }
        });
    }
    // --------------- Private methods --------------------
    reportClientClosedBrowserTab(connection) {
        Syslog_1.Syslog.log(connection.getUserInfo() + " has disconnected by"
            + " closing or reloading browser tab", MessageType_1.MessageType.CONNECTION_INFO);
    }
}
exports.SystemMessage = SystemMessage;
Classes_1.Classes.registerSerializableClass(SystemMessage);
//# sourceMappingURL=SceneUpdate.js.map