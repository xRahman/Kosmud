/*
  Part of BrutusNEXT

  Defines types of messages.
*/
define(["require", "exports"], function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var MessageType;
    (function (MessageType) {
        // -------------------- Communication ------------------------
        MessageType[MessageType["TELL"] = 0] = "TELL";
        MessageType[MessageType["GOSSIP"] = 1] = "GOSSIP";
        MessageType[MessageType["GOSSIPEMOTE"] = 2] = "GOSSIPEMOTE";
        MessageType[MessageType["SAY"] = 3] = "SAY";
        MessageType[MessageType["QUEST"] = 4] = "QUEST";
        MessageType[MessageType["WIZNET"] = 5] = "WIZNET";
        MessageType[MessageType["SHOUT"] = 6] = "SHOUT";
        MessageType[MessageType["EMOTE"] = 7] = "EMOTE";
        MessageType[MessageType["INFO"] = 8] = "INFO";
        // --------------------- Syslog messages ---------------------
        // Sent when REPORT(error) is called somewhere in code.
        MessageType[MessageType["RUNTIME_EXCEPTION"] = 9] = "RUNTIME_EXCEPTION";
        // Sent when ERROR() is called somewhere in code.
        MessageType[MessageType["RUNTIME_ERROR"] = 10] = "RUNTIME_ERROR";
        // Sent when FATAL_ERROR() is called somewhere in code.
        MessageType[MessageType["FATAL_RUNTIME_ERROR"] = 11] = "FATAL_RUNTIME_ERROR";
        // System reports that something is ok (game is successfuly loaded, etc.).
        MessageType[MessageType["SYSTEM_INFO"] = 12] = "SYSTEM_INFO";
        // System reports that something didn't go as expected
        // (socket errors, file read errors, etc.)
        MessageType[MessageType["SYSTEM_ERROR"] = 13] = "SYSTEM_ERROR";
        // Messages from telnet server.
        MessageType[MessageType["TELNET_SERVER"] = 14] = "TELNET_SERVER";
        // Messages from http server.
        MessageType[MessageType["HTTP_SERVER"] = 15] = "HTTP_SERVER";
        // Messages from websocket server.
        MessageType[MessageType["WEBSOCKET_SERVER"] = 16] = "WEBSOCKET_SERVER";
        // Sent when ingame script fails to compile (because of syntax errors).
        MessageType[MessageType["SCRIPT_COMPILE_ERROR"] = 17] = "SCRIPT_COMPILE_ERROR";
        // Sent when ingame script encounters runtime error.
        MessageType[MessageType["SCRIPT_RUNTIME_ERROR"] = 18] = "SCRIPT_RUNTIME_ERROR";
        // Send when someone tries to access invalid entity reference
        // or invalid value variable.
        MessageType[MessageType["INVALID_ACCESS"] = 19] = "INVALID_ACCESS";
        // ------------------ Authentication messages ----------------
        // Authentication messages like "Enter your password:"
        MessageType[MessageType["AUTH_PROMPT"] = 20] = "AUTH_PROMPT";
        // Authentication messages like "You have reconnected to your character."
        MessageType[MessageType["AUTH_INFO"] = 21] = "AUTH_INFO";
        // Screen show before entering menu (MOTD, last logind info).
        MessageType[MessageType["LOGIN_INFO"] = 22] = "LOGIN_INFO";
        // --------------------- Chargen messages --------------------
        // Chargen messages like "What's the name of your character?".
        MessageType[MessageType["CHARGEN_PROMPT"] = 23] = "CHARGEN_PROMPT";
        // -------------------- Connection messages ------------------
        MessageType[MessageType["CONNECTION_INFO"] = 24] = "CONNECTION_INFO";
        // Something went wrong that causes player to get disconnected.
        MessageType[MessageType["CONNECTION_ERROR"] = 25] = "CONNECTION_ERROR";
        // ------------------------- Game menu -----------------------
        MessageType[MessageType["GAME_MENU"] = 26] = "GAME_MENU";
        // ------------------------- Commands ------------------------
        // Skill messages
        MessageType[MessageType["SKILL"] = 27] = "SKILL";
        // Spell messages
        MessageType[MessageType["SPELL"] = 28] = "SPELL";
        // (Output from non-skill commands like 'who', 'promote', etc.).
        MessageType[MessageType["COMMAND"] = 29] = "COMMAND";
    })(MessageType = exports.MessageType || (exports.MessageType = {}));
});
//# sourceMappingURL=MessageType.js.map