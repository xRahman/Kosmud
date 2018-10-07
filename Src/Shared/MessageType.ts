/*
  Part of Kosmud

  Defines types of messages.
*/

export enum MessageType
{
  // -------------------- Communication ------------------------

  TELL,
  GOSSIP,
  GOSSIPEMOTE,
  SAY,
  QUEST,
  WIZNET,
  SHOUT,
  EMOTE,
  INFO,

  // --------------------- Syslog messages ---------------------

  // Sent when REPORT(error) is called somewhere in code. Contains original
  // exception.
  RUNTIME_EXCEPTION,
  // Sent when exeption propagates to the top-level function (which shouldn't
  // happen).
  UNCAUGHT_EXCEPTION,
  // Sent when ERROR() is called somewhere in code.
  RUNTIME_ERROR,
  // System reports that something is ok (game is successfuly loaded, etc.).
  SYSTEM_INFO,
  // System reports that something didn't go as expected
  // (socket errors, file read errors, etc.)
  SYSTEM_ERROR,
  // Messages from telnet server.
  TELNET_SERVER,
  // Messages from http server.
  HTTP_SERVER,
  // Messages from https server.
  HTTPS_SERVER,
  // Messages from websocket communication.
  WEBSOCKET,
  // Messages from websocket server.
  WEBSOCKET_SERVER,
  // Sent when ingame script fails to compile (because of syntax errors).
  SCRIPT_COMPILE_ERROR,
  // Sent when ingame script encounters runtime error.
  SCRIPT_RUNTIME_ERROR,
  // Send when someone tries to access invalid entity reference
  // or invalid value variable.
  INVALID_ACCESS,

  // ------------------ Authentication messages ----------------

  // Authentication messages like "Enter your password:"
  AUTH_PROMPT,
  // Authentication messages like "You have reconnected to your character."
  AUTH_INFO,
  // Screen show before entering menu (MOTD, last logind info).
  LOGIN_INFO,

  // --------------------- Chargen messages --------------------

  // Chargen messages like "What's the name of your character?".
  CHARGEN_PROMPT,

  // -------------------- Connection messages ------------------
  
  CONNECTION_INFO,
  // Something went wrong that causes player to get disconnected.
  CONNECTION_ERROR,

  // ------------------------- Game menu -----------------------

  GAME_MENU,

  // ------------------------- Commands ------------------------

  // Skill messages
  SKILL,
  // Spell messages
  SPELL,
  // (Output from non-skill commands like 'who', 'promote', etc.).
  COMMAND
}