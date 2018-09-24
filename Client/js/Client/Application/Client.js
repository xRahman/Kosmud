/*
  Part of Kosmud

  Client application.

  Usage:
    Client.start();
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "../Phaser/PhaserEngine", "../../Shared/Application", "../../Shared/MessageType", "../../Shared/Syslog", "../../Client/Application/ClientSyslog", "../../Client/Gui/Document", "../../Client/Net/Connection", "../../Shared/Net/WebSocketEvent"], function (require, exports, PhaserEngine_1, Application_1, MessageType_1, Syslog_1, ClientSyslog_1, Document_1, Connection_1, WebSocketEvent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    PhaserEngine_1.PhaserEngine; // Inits the class.
    class Client extends Application_1.Application {
        constructor() {
            // -------------- Static constants --------------------
            super(...arguments);
            // ---------------- Protected data --------------------
            // ----------------- Private data ---------------------
            // There is only one connection per client application
            // (it means one connection per browser tab if you
            //  open the client in multiple tabs).
            this.connection = new Connection_1.Connection();
            // Html document.
            this.document = new Document_1.Document();
        }
        // --------------- Static accessors -------------------
        static get document() { return this.instance.document; }
        static get connection() { return this.instance.connection; }
        // ------------- Public static methods ----------------
        static start() {
            return __awaiter(this, void 0, void 0, function* () {
                Syslog_1.Syslog.log("Starting Kosmud client...", MessageType_1.MessageType.SYSTEM_INFO);
                Client.instance.initGUI();
                Client.instance.connection.connect();
            });
        }
        // --------------- Protected methods ------------------
        // ~ Overrides App.reportException().
        reportException(error) {
            this.report(error);
        }
        // ~ Overrides App.reportError().
        reportError(message) {
            this.report(new Error(message));
        }
        // ~ Overrides App.reportFatalError().
        reportFatalError(message) {
            // There is no point in 'crashing' the client, it's just
            // a web page. So we just report the error.
            this.report(new Error(message));
        }
        // ~ Overrides App.log().
        log(message, msgType) {
            ClientSyslog_1.ClientSyslog.log(message, msgType);
        }
        // ---------------- Private methods -------------------
        report(error) {
            // Throw an error instead of reporting to the console
            // because this way Chrome prints out stack trace using
            // source maps (so in .ts files) rathen than in .js files
            // (which is not so useful).
            throw error;
        }
        initGUI() {
            window.onbeforeunload =
                (event) => { this.onBeforeUnload(event); };
        }
        // ---------------- Event handlers --------------------
        onBeforeUnload(event) {
            this.connection.reportClosingBrowserTab();
            // Close the connection to prevent browser from closing it
            // abnormally with event code 1006.
            //   For some strange reson this doesn't alway work in Chrome.
            // If we call socket.close(1000, "Tab closed"), onClose() event
            // handler on respective server socket will receive the reason
            // but sometimes code will be 1006 instead of 1000. To circumvent
            // this, we send WebSocketEvent.REASON_CLOSE when socket is closed
            // from onBeforeUnload() and we check for it in ServerSocket.onClose().
            this.connection.close(WebSocketEvent_1.WebSocketEvent.TAB_CLOSED);
        }
    }
    // -------------- Static class data -------------------
    // Here we also assign Client instance to Application.instance property
    // so it will be accessible from shared code. Without this, functions
    // like ERROR() would not work because Application.instance would be
    // 'null'.
    Client.instance = Application_1.Application.instance = new Client();
    exports.Client = Client;
});
// ------------------ Type declarations ----------------------
//# sourceMappingURL=Client.js.map