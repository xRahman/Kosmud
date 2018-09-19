"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const Application_1 = require("../../Shared/Application");
const ERROR_1 = require("../../Shared/ERROR");
const Syslog_1 = require("../../Shared/Syslog");
const ServerSyslog_1 = require("../../Server/Application/ServerSyslog");
const MessageType_1 = require("../../Shared/MessageType");
const HttpServer_1 = require("../../server/Net/HttpServer");
class Server extends Application_1.Application {
    constructor() {
        // -------------- Static constants --------------------
        super(...arguments);
        // ----------------- Private data ---------------------
        /// Http server also runs a websocket server inside it.
        this.httpServer = new HttpServer_1.HttpServer();
    }
    // ---------------- Protected data --------------------
    // ------------- Public static methods ----------------
    static start(appName, version) {
        return __awaiter(this, void 0, void 0, function* () {
            Syslog_1.Syslog.log("Starting " + appName + " server (v" + version + ")...", MessageType_1.MessageType.SYSTEM_INFO);
            // Http server also starts a websocket server inside it.
            this.instance.startHttpServer();
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
        if (this.httpServer.isOpen()) {
            ERROR_1.ERROR("Http server is already running");
            return;
        }
        this.httpServer.start();
    }
}
// --------------- Static accessors -------------------
// --------------- Static accessors -------------------
// -------------- Static class data -------------------
// Here we also assign Client instance to Application.instance property
// so it will be accessible from shared code. Without this, functions
// like ERROR() would not work because Application.instance would be
// 'null'.
Server.instance = Application_1.Application.instance = new Server();
exports.Server = Server;
//# sourceMappingURL=Server.js.map