/*
  Part of Kosmud

  Client application.

  Usage:
    Client.start();
*/
define(["require", "exports", "../Phaser/PhaserEngine", "../../Shared/Application", "../../Shared/MessageType", "../../Shared/Syslog", "../../Client/Application/ClientSyslog", "../../Client/Gui/Document"], function (require, exports, PhaserEngine_1, Application_1, MessageType_1, Syslog_1, ClientSyslog_1, Document_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    PhaserEngine_1.PhaserEngine; // Inits the class.
    class Client extends Application_1.Application {
        constructor() {
            // -------------- Static constants --------------------
            super(...arguments);
            // ---------------- Protected data --------------------
            // ----------------- Private data ---------------------
            // Html document.
            this.document = new Document_1.Document();
            // ---------------- Event handlers --------------------
        }
        // --------------- Static accessors -------------------
        static get document() { return this.instance.document; }
        // ------------- Public static methods ----------------
        static async start() {
            Syslog_1.Syslog.log("Starting Kosmud client version...", MessageType_1.MessageType.SYSTEM_INFO);
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