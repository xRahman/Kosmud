/*
  Part of BrutusNEXT

  Encapsulates a websocket.
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
const WebSocketEvent_1 = require("../../Shared/Net/WebSocketEvent");
const MessageType_1 = require("../../Shared/MessageType");
// Built-in node.js modules.
// import * as net from 'net';  // Import namespace 'net' from node.js
// import * as events from 'events';  // Import namespace 'events' from node.js
class ServerSocket {
    constructor(connection, webSocket, 
    // Remote ip address.
    ip, 
    // Remote url.
    url) {
        this.connection = connection;
        this.webSocket = webSocket;
        this.ip = ip;
        this.url = url;
        this.init();
    }
    // -------------- Static class data -------------------
    // ----------------- Private data ---------------------
    // ----------------- Public data ----------------------
    ///public connection: (Connection | null) = null;
    // --------------- Public accessors -------------------
    getOrigin() {
        return "(" + this.url + " [" + this.ip + "])";
    }
    getIpAddress() {
        return this.ip;
    }
    // ---------------- Public methods --------------------
    // Sends packet to the client.
    send(data) {
        try {
            this.webSocket.send(data);
        }
        catch (error) {
            Syslog_1.Syslog.log("Client ERROR: Failed to send packet to websocket"
                + " " + this.getOrigin() + ". Reason: " + error.message, MessageType_1.MessageType.WEBSOCKET_SERVER);
        }
    }
    // Closes the socket, ending the connection.
    // -> Returns 'false' if connection couldn't be closed.
    close() {
        if (!this.webSocket)
            return false;
        // If the socket is already closed, close() would do nothing.
        if (this.webSocket.readyState === 3) // '3' means CLOSED.
            return false;
        this.webSocket.close();
        return true;
    }
    // -------------- Protected methods -------------------
    // --------------- Private methods --------------------
    // Registers event handlers, etc.
    init() {
        if (this.webSocket === null || this.webSocket === undefined) {
            ERROR_1.ERROR('Attempt to init invalid socket');
            return;
        }
        this.webSocket.onmessage = (event) => { this.onReceiveMessage(event); };
        this.webSocket.onopen = (event) => { this.onOpen(event); };
        this.webSocket.onerror = (event) => { this.onError(event); };
        this.webSocket.onclose = (event) => { this.onClose(event); };
    }
    reportSocketClosingError(event) {
        let message = "Socket " + this.getOrigin() + " closed"
            + " because of error.";
        if (event.reason)
            message += " Reason: " + event.reason;
        message += " Code: " + event.code + ". Description:";
        message += " " + WebSocketEvent_1.WebSocketEvent.description(event.code);
        Syslog_1.Syslog.log(message, MessageType_1.MessageType.WEBSOCKET_SERVER);
    }
    reportSocketClosing(event) {
        // Error code 1000 means that the connection was closed normally.
        // 'event.reason' is checked because for some reason Chrome sometimes
        // closes webSocket with code 1006 when the tab is closed even though
        // we close() the socket manually in onBeforeUnload() handler (see
        // ClientApp.onBeforeUnload() for more details).
        if (event.code === 1000 || event.reason === WebSocketEvent_1.WebSocketEvent.TAB_CLOSED) {
            Syslog_1.Syslog.log("Connection " + this.getOrigin() + " has been closed", MessageType_1.MessageType.WEBSOCKET_SERVER);
            return;
        }
        this.reportSocketClosingError(event);
    }
    // ---------------- Event handlers --------------------
    onReceiveMessage(event) {
        return __awaiter(this, void 0, void 0, function* () {
            // if (flags.binary === true)
            // {
            //   // Data is supposed to be sent in text mode.
            //   // (This is a client error, we can't really do
            //   //  anything about it - so we just log it.)
            //   Syslog.log
            //   (
            //     "Client ERROR: Received binary data from connection"
            //       + " " + this.getOrigin() + ". Data is not processed",
            //     MessageType.WEBSOCKET_SERVER,
            //     AdminLevel.IMMORTAL
            //   );
            //   return;
            // }
            if (typeof event.data !== 'string') {
                ERROR_1.ERROR("Websocket " + this.getOrigin() + " received"
                    + " non-string data. Message will not be processed"
                    + " because we can only process string data");
                return;
            }
            /// DEBUG:
            console.log('(ws) received message: ' + event.data);
            try {
                yield this.connection.receiveData(event.data);
            }
            catch (error) {
                Syslog_1.Syslog.reportUncaughtException(error);
            }
        });
    }
    onOpen(event) {
        // No action.
    }
    onError(event) {
        Syslog_1.Syslog.log("Websocket ERROR: Error occured on websocket " + this.getOrigin()
            + " :" + event.message, MessageType_1.MessageType.WEBSOCKET_SERVER);
    }
    onClose(event) {
        this.reportSocketClosing(event);
        if (!this.connection) {
            ERROR_1.ERROR("Missing connection reference on websocket."
                + " Account and connection won't be released"
                + " from memory");
            return;
        }
        this.connection.release();
    }
}
exports.ServerSocket = ServerSocket;
//# sourceMappingURL=ServerSocket.js.map