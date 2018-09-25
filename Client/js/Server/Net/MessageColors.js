/*
  Part of BrutusNEXT

  Base color codes of messages.
*/
define(["require", "exports", "../../Shared/ERROR", "../../Shared/MessageType"], function (require, exports, ERROR_1, MessageType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MessageColors {
        // All messages should end with this color so player
        // input always uses it. 
        static get INPUT_COLOR() {
            return '&w';
        }
        // Accesses MessageColors.colors table, prints error if there is no
        // such record.
        static getBaseColor(msgType) {
            let baseColor = MessageColors.baseColors[MessageType_1.MessageType[msgType]];
            if (baseColor === undefined) {
                ERROR_1.ERROR("Missing base color for Message.Type"
                    + " '" + MessageType_1.MessageType[msgType] + "'");
                // Default base color is '&w'.
                return '&w';
            }
            return baseColor;
        }
    }
    // Base message colors for each Message.Type.
    MessageColors.baseColors = {
        // -------------------- Communication ------------------------
        TELL: '&g',
        GOSSIP: '&m',
        GOSSIPEMOTE: '&m',
        SAY: '&w',
        QUEST: '&g',
        WIZNET: '&C',
        SHOUT: '&G',
        EMOTE: '&g',
        INFO: '&W',
        // --------------------- Syslog messages ---------------------
        RUNTIME_EXCEPTION: '&w',
        RUNTIME_ERROR: '&w',
        FATAL_RUNTIME_ERROR: '&R',
        SYSTEM_INFO: '&g',
        SYSTEM_ERROR: '&g',
        TELNET_SERVER: '&g',
        HTTP_SERVER: '&g',
        WEBSOCKET_SERVER: '&g',
        SCRIPT_COMPILE_ERROR: '&g',
        SCRIPT_RUNTIME_ERROR: '&g',
        INVALID_ACCESS: '&g',
        // ------------------ Authentication messages ----------------
        AUTH_PROMPT: '&w',
        AUTH_INFO: '&w',
        LOGIN_INFO: '&w',
        // --------------------- Chargen messages --------------------
        CHARGEN_PROMPT: '&w',
        // -------------------- Connection messages ------------------
        CONNECTION_INFO: '&g',
        CONNECTION_ERROR: '&R',
        // ------------------------- Game menu -----------------------
        GAME_MENU: '&w',
        // ------------------------- Commands ------------------------
        SKILL: '&g',
        SPELL: '&g',
        COMMAND: '&g'
    };
    exports.MessageColors = MessageColors;
});
//# sourceMappingURL=MessageColors.js.map