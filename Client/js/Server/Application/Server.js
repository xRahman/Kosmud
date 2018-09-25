/*
  Part of Kosmud

  Server application.

  Usage:
    Server.start(appName, version);
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "../../Shared/Application", "../../Shared/ERROR", "../../Shared/Syslog", "../../Server/Application/ServerSyslog", "../../Shared/MessageType", "../../Server/Net/HttpServer", "../../Server/Game/Game", "../../Server/Net/Connections"], function (require, exports, Application_1, ERROR_1, Syslog_1, ServerSyslog_1, MessageType_1, HttpServer_1, Game_1, Connections_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Server extends Application_1.Application {
        constructor() {
            // -------------- Static constants --------------------
            super(...arguments);
            // ----------------- Private data ---------------------
            /// Http server also runs a websocket server inside it.
            this.httpServer = new HttpServer_1.HttpServer();
            // ---------------- Protected data --------------------
            // ----------------- Private data ---------------------
            this.game = new Game_1.Game();
            this.connections = new Connections_1.Connections();
        }
        // --------------- Static accessors -------------------
        static get connections() { return this.instance.connections; }
        // ------------- Public static methods ----------------
        static start(appName, version) {
            return __awaiter(this, void 0, void 0, function* () {
                Syslog_1.Syslog.log("Starting " + appName + " server (v" + version + ")...", MessageType_1.MessageType.SYSTEM_INFO);
                // Http server also starts a websocket server inside it.
                yield this.instance.startHttpServer();
                // Start the game loop.
                this.instance.game.start();
            });
        }
        // --------------- Protected methods ------------------
        // ~ Overrides App.reportException().
        reportException(error) {
            let errorMsg = error.message + "\n";
            if (error.stack)
                errorMsg += error.stack;
            else
                errorMsg += Syslog_1.Syslog.STACK_IS_NOT_AVAILABLE;
            Syslog_1.Syslog.log(errorMsg, MessageType_1.MessageType.RUNTIME_EXCEPTION);
        }
        // ~ Overrides App.reportError().
        reportError(message) {
            let stackTrace = Syslog_1.Syslog.getTrimmedStackTrace();
            let errorMsg = message;
            if (stackTrace)
                errorMsg += "\n" + Syslog_1.Syslog.getTrimmedStackTrace();
            Syslog_1.Syslog.log(errorMsg, MessageType_1.MessageType.RUNTIME_ERROR);
        }
        // ~ Overrides App.reportFatalError().
        // Reports error message and stack trace and terminates the program.
        // (Don't call this method directly, use FATAL_ERROR()
        //  from /Shared/Error/ERROR).
        reportFatalError(message) {
            let errorMsg = message + "\n"
                + Syslog_1.Syslog.getTrimmedStackTrace();
            Syslog_1.Syslog.log(errorMsg, MessageType_1.MessageType.FATAL_RUNTIME_ERROR);
            // Because promises are eating exceptions, throwing an error won't stop
            // the program if FATAL_ERROR() is called from within asynchronous method.
            // So we rather print stack trace ourselves (using Syslog.log() above)
            // and exit the program manually.
            process.exit(1);
        }
        // ~ Overrides App.log().
        // Logs the message and sends it to all online
        // admins with sufficient 'adminLevel'.
        log(message, msgType) {
            ServerSyslog_1.ServerSyslog.log(message, msgType);
        }
        // --------------- Private methods --------------------
        startHttpServer() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.httpServer.isOpen()) {
                    ERROR_1.ERROR("Http server is already running");
                    return;
                }
                yield this.httpServer.start();
            });
        }
    }
    // -------------- Static class data -------------------
    // Here we also assign Client instance to Application.instance property
    // so it will be accessible from shared code. Without this, functions
    // like ERROR() would not work because Application.instance would be
    // 'null'.
    Server.instance = Application_1.Application.instance = new Server();
    exports.Server = Server;
});
//# sourceMappingURL=Server.js.map