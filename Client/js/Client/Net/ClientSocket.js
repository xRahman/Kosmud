/*
  Part of BrutusNEXT

  Encapsulates a web socket.
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "../../Shared/ERROR", "../../Shared/Syslog", "../../Shared/Net/WebSocketEvent"], function (require, exports, ERROR_1, Syslog_1, WebSocketEvent_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    class ClientSocket {
        constructor(connection) {
            this.connection = connection;
            // -------------- Static class data -------------------
            // ----------------- Private data ---------------------
            this.socket = null;
            // Here we remember event listeners so we can remove them
            // when the socket closes.
            this.listeners = {
                onopen: null,
                onmessage: null,
                onerror: null,
                onclose: null
            };
            // We still need this even though WebSocket keeps it's status
            // in .readyState property. The reason is that events don't know
            // what caused them. If for example the websocket server is down
            // and we try to connect to it, an 'error' and a 'close' events
            // are fired after the timeout. In both cases, socket.readyState
            // is set to WebSocket.CLOSED so we have no way to determine
            // if the connection couldn't even be estableshed or if it was
            // opened and then something caused a disconnect.
            //   To solve this, we set 'this.open' to true only when 'open'
            // event is fired. So when the 'error' or 'close' event comes
            // and 'this.wasConnected' is still false, it means failure to
            // connect, otherwise it means a disconnect.
            this.wasConnected = false;
            this.connection = connection;
        }
        // ---------------- Static methods --------------------
        static checkWebSocketSupport() {
            if (typeof WebSocket === 'undefined') {
                let MozWebSocket = window['MozWebSocket'];
                // Use 'MozWebSocket' if it's available.
                if (MozWebSocket) {
                    WebSocket = MozWebSocket;
                    return true;
                }
                alert("Sorry, you browser doesn't support websockets.");
                return false;
            }
            return true;
        }
        // ----------------- Public data ----------------------
        //public connection: (Connection | null) = null;
        // ---------------- Public methods --------------------
        isOpen() {
            if (this.socket === null)
                return false;
            return this.socket.readyState === WebSocket.OPEN;
        }
        isConnecting() {
            if (this.socket === null)
                return false;
            return this.socket.readyState === WebSocket.CONNECTING;
        }
        isClosing() {
            if (this.socket === null)
                return false;
            return this.socket.readyState === WebSocket.CLOSING;
        }
        isClosed() {
            // If we don't have a socket, it's considered closed.
            if (this.socket === null)
                return true;
            return this.socket.readyState === WebSocket.CLOSED;
        }
        // Sends a string to the user.
        send(data) {
            console.log("Sending data: " + data);
            // No point in sending data unless the socket is open.
            if (!this.isOpen())
                return;
            if (this.socket) {
                try {
                    this.socket.send(data);
                }
                catch (error) {
                    ERROR_1.ERROR("Websocket ERROR: Failed to send data to the socket."
                        + " Reason: " + error.message);
                }
            }
        }
        // Attempt to open a web socket.
        connect() {
            if (this.socket !== null)
                ERROR_1.ERROR("Socket already exists");
            // (There is no point in error handling here, because
            //  opening a socket is asynchronnous. If an error occurs,
            //  'error' event is fired and onSocketError() is launched.)
            ///this.socket = new WebSocket('ws://127.0.0.1:80/');
            /// Port 80 zjevně není třeba uvádět.
            //this.socket = new WebSocket('wss://' + window.location.hostname + ':443');
            this.socket = new WebSocket('wss://' + window.location.hostname);
            ///console.log('connect(). Status: ' + this.socket.readyState);
            if (this.socket)
                this.init();
        }
        // Attempts to reconnect.
        reConnect() {
            ///console.log('reConnect(). Status: ' + this.socket.readyState);
            if (this.isOpen())
                // There is no point in reconnecting an open socket.
                return;
            if (this.isConnecting())
                // There is no point if the socket is already trying to connect.
                return;
            if (this.isConnecting())
                // If the socket is still closing, old event handlers are not yet
                // detached so we shouldn't create a new socket yet.
                /// TODO: Asi by to chtelo dát message playerovi a ideálně
                /// pustit auto-reconnect, pokud ještě neběží.
                return;
            /// To be deleted.
            // if (this.connection === null)
            // {
            //   ERROR("Unexpected 'null' value");
            //   return;
            // }
            this.connection.clientMessage('Attempting to reconnect...');
            this.connect();
        }
        // Closes the socket, ending the connection.
        close(reason = null) {
            if (this.socket === null) {
                ERROR_1.ERROR("Unexpected 'null' value");
                return;
            }
            // Code '1000' means normal connection close.
            if (reason)
                this.socket.close(1000, reason);
            else
                this.socket.close(1000);
        }
        // ---------------- Private methods -------------------
        reportConnectionFailure() {
            /// To be deleted.
            // if (this.connection === null)
            // {
            //   ERROR("Unexpected 'null' value");
            //   return;
            // }
            // Test is user device is online.
            if (navigator.onLine) {
                this.connection.clientMessage('Failed to open websocket connection.'
                    + ' Server is down or unreachable.');
            }
            else {
                this.connection.clientMessage('Failed to open websocket connection. Your device reports'
                    + ' offline status. Please check your internet connection.');
            }
        }
        // Prints message to the console.
        logSocketClosed(event) {
            let message = "Socket closed";
            if (event.reason) {
                message += " because of error: " + event.reason;
            }
            message += " (code: " + event.code + ", description:"
                + " " + WebSocketEvent_1.WebSocketEvent.description(event.code) + ")";
            console.log();
        }
        reportNormalDisconnect() {
            /// To be deleted.
            // if (this.connection === null)
            // {
            //   ERROR("Unexpected 'null' value");
            //   return;
            // }
            this.connection.clientMessage('Connection closed.');
        }
        reportAbnormalDisconnect() {
            /// To be deleted.
            // if (this.connection === null)
            // {
            //   ERROR("Unexpected 'null' value");
            //   return;
            // }
            // Test if user is online.
            if (navigator.onLine) {
                this.connection.clientMessage('You have been disconnected from the server.');
            }
            else {
                this.connection.clientMessage('You have been disconnected. Your device reports'
                    + ' offline status, please check your internet connection.');
            }
        }
        // Attaches event handlers to this.socket.
        init() {
            // Remember event listeners so we can close them later.
            this.listeners.onopen = (event) => { this.onOpen(event); };
            this.listeners.onmessage = (event) => { this.onReceiveMessage(event); };
            this.listeners.onerror = (event) => { this.onError(event); };
            this.listeners.onclose = (event) => { this.onClose(event); };
            if (this.socket === null) {
                ERROR_1.ERROR("Unexpected 'null' value");
                return;
            }
            // Assign them to the socket.
            this.socket.onopen = this.listeners.onopen;
            this.socket.onmessage = this.listeners.onmessage;
            this.socket.onerror = this.listeners.onerror;
            this.socket.onclose = this.listeners.onclose;
        }
        // Removes event handlers from this.socket.
        deinit() {
            if (this.socket === null) {
                ERROR_1.ERROR("Unexpected 'null' value");
                return;
            }
            if (this.listeners.onopen)
                this.socket.removeEventListener('open', this.listeners.onopen);
            if (this.listeners.onmessage)
                this.socket.removeEventListener('message', this.listeners.onmessage);
            if (this.listeners.onerror)
                this.socket.removeEventListener('error', this.listeners.onerror);
            if (this.listeners.onclose)
                this.socket.removeEventListener('close', this.listeners.onclose);
        }
        // ---------------- Event handlers --------------------
        onOpen(event) {
            // 'open' event menas that connection has been succesfully
            // established. We remember it so we can later determine
            // if an error means failure to connect or a disconnect.
            this.wasConnected = true;
            ///console.log('onOpen(). Status: ' + this.socket.readyState);
            console.log('Socket opened');
            /// TODO: (info, že se podařilo připojit).
            /// To je asi zbytecny, server posle uvodni 'obrazovku'
        }
        onReceiveMessage(event) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log('Received message: ' + event.data);
                if (typeof event.data !== 'string') {
                    ERROR_1.ERROR("Websocket received non-string data."
                        + " Message will not be processed because"
                        + " we can only process string data");
                    return;
                }
                try {
                    yield this.connection.receiveData(event.data);
                }
                catch (error) {
                    Syslog_1.Syslog.reportUncaughtException(error);
                }
            });
        }
        onError(event) {
            ///console.log('onSocketError(). Status: ' + this.socket.readyState);
            // If 'error' event fired when the connection was open,
            // it will disconnect the player. We just log it to the
            // console for debugging purposes, user will be notified
            // when 'close' event is fired.
            if (event.error) {
                ERROR_1.ERROR("Socket error occured: " + event.error
                    + " The connection will close");
            }
            else {
                ERROR_1.ERROR("Socket error occured, the connection will close");
            }
        }
        onClose(event) {
            ///console.log('onSocketClose(). Status: ' + this.socket.readyState);
            // Remove event handlers from the socket.
            this.deinit();
            this.socket = null;
            // Print message to the console for debugging purposes.
            this.logSocketClosed(event);
            // Let the user know what happened.
            // (Error code 1000 means that the connection was closed normally.)
            if (event.code === 1000) {
                this.reportNormalDisconnect();
            }
            else {
                if (this.wasConnected === false)
                    // If the connection hasn't even been open, we report
                    // the connecting failure.
                    this.reportConnectionFailure();
                else
                    // Otherwise we report a disconnect.
                    this.reportAbnormalDisconnect();
                /// TODO: Auto reconnect:
                /// (Vyhledove by to taky chtelo timer, aby to zkousel opakovane).
            }
        }
    }
    exports.ClientSocket = ClientSocket;
});
//# sourceMappingURL=ClientSocket.js.map