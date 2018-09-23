/*
  Part of BrutusNEXT

  Implements websocket server.
*/
/*
  Implementation note:
    Event handlers are registered using lambda expression '() => {}'.
    For example:

      this.webSocketServer.on
      (
        'error',
        (error) => { this.onServerError(error); }
      );

    The reason is that it is not guaranteed in TypeScript that methods
    will get called on an instance of their class. In other words 'this'
    will be something else than you expect when you register an event
    handler.
      Lambda expression solves this by capturing 'this', so you may use it
    correcly within lambda function body.
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
const Connection_1 = require("../../Server/Net/Connection");
const Connections_1 = require("../../Server/Net/Connections");
// 3rd party modules.
const WebSocket = require("ws");
class WebSocketServer {
    constructor() {
        // ----------------- Public data ----------------------
        // Do we accept new connections?
        this.open = false;
        // ----------------- Private data ---------------------
        this.webSocketServer = null;
    }
    // ---------------- Public methods --------------------
    isOpen() { return this.open; }
    // Starts the websocket server inside a http server.
    start(httpServer) {
        Syslog_1.Syslog.log("Starting websocket server", MessageType_1.MessageType.SYSTEM_INFO);
        // Websocket server runs inside a http server so the same port can be used
        // (it is possible because WebSocket protocol is an extension of http).
        this.webSocketServer = new WebSocket.Server({ server: httpServer });
        this.webSocketServer.on('connection', (socket, request) => { this.onNewConnection(socket, request); });
        // Unlike telnet server, websocket server is up immediately,
        // so we don't have to register handler for 'listening' event
        // (in fact, there is no such event on websocket server).
        //   But since the websocket server runs inside a http server,
        // it must be started after onStartListening() is fired on http
        // server.
        Syslog_1.Syslog.log("Websocket server is up and listening to new connections", MessageType_1.MessageType.WEBSOCKET_SERVER);
        this.open = true;
    }
    // ---------------- Event handlers --------------------
    onNewConnection(webSocket, request) {
        return __awaiter(this, void 0, void 0, function* () {
            let ip = request.connection.remoteAddress;
            if (!ip)
                ip = "Unknown ip address";
            ///let ip = ServerSocket.parseRemoteAddress(socket);
            // Request.url is only valid for request obtained from http.Server.
            if (!request.url) {
                ERROR_1.ERROR("Invalid 'request.url'. This probably means that you are using"
                    + " websocket server outside of http server. Connection is denied");
                this.denyConnection(webSocket, "Invalid request.url", ip);
                return;
            }
            let url = request.url;
            //let url = ServerSocket.parseRemoteUrl(socket);
            if (this.open === false) {
                this.denyConnection(webSocket, "Server is closed", ip, url);
                return;
            }
            this.acceptConnection(webSocket, ip, url);
        });
    }
    // ---------------- Private methods --------------------
    acceptConnection(webSocket, ip, url) {
        let connection = new Connection_1.Connection(webSocket, ip, url);
        Connections_1.Connections.add(connection);
        Syslog_1.Syslog.log("Accepting connection " + connection.getOrigin(), MessageType_1.MessageType.WEBSOCKET_SERVER);
    }
    denyConnection(socket, reason, ip, url) {
        let address;
        if (url)
            address = "(" + url + "[" + ip + "])";
        else
            address = "[" + ip + "]";
        Syslog_1.Syslog.log("Denying connection " + address + ": " + reason, MessageType_1.MessageType.WEBSOCKET_SERVER);
        socket.close();
    }
}
exports.WebSocketServer = WebSocketServer;
//# sourceMappingURL=WebSocketServer.js.map