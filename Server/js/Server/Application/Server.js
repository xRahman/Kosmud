"use strict";
/*
  Part of Kosmud

  Implements server application.

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
const ERROR_1 = require("../../Shared/Error/ERROR");
// import {FATAL_ERROR} from '../../../shared/lib/error/FATAL_ERROR';
// import {Time} from '../../../shared/lib/utils/Time';
// import {ServerEntities} from '../../../server/lib/entity/ServerEntities';
// import {FileSystem} from '../../../server/lib/fs/FileSystem';
// import {Admins} from '../../../server/lib/admin/Admins';
// import {AdminLevel} from '../../../shared/lib/admin/AdminLevel';
// import {Connections} from '../../../server/lib/connection/Connections';
// import {ServerPrototypes} from '../../../server/lib/entity/ServerPrototypes';
// import {Accounts} from '../../../server/lib/account/Accounts';
const Syslog_1 = require("../../Shared/Syslog");
const ServerSyslog_1 = require("../../Server/Application/ServerSyslog");
const MessageType_1 = require("../../Shared/MessageType");
// import {Game} from '../../../server/game/Game';
// import {GameEntity} from '../../../server/game/GameEntity';
// ///import {TelnetServer} from '../../../server/lib/net/TelnetServer';
const HttpServer_1 = require("../../server/Net/HttpServer");
class Server extends Application_1.Application {
    constructor() {
        // -------------- Static constants --------------------
        super(...arguments);
        // public static readonly DATA_DIRECTORY = './server/data/';
        // --------------- Static accessors -------------------
        // public static get timeOfBoot() { return this.instance.timeOfBoot; }
        // public static get game() { return this.instance.game; }
        // public static get accounts() { return this.instance.accounts; }
        // public static get connections() { return this.instance.connections; }
        // public static get admins() { return this.instance.admins; }
        // --------------- Static accessors -------------------
        // // ~ Overrides App.entities()
        // // (Override exists in order to return type be ServerEntities.)
        // public static get entities() { return this.instance.entities; }
        // // ~ Overrides App.prototypes()
        // // (Override exists in order to return type be ServerPrototypes.)
        // public static get prototypes() { return this.instance.prototypes; }
        // -------------- Static class data -------------------
        // // ~ Overrides App.instance.
        // protected static instance = new Server();
        // ----------------- Private data ---------------------
        // // 'null' means no message of the day is set at the moment.
        // private messageOfTheDay: (string | null) = null;
        // private admins = new Admins();
        // private timeOfBoot = new Time();
        // private game = new Game();
        /// Http server also runs a websocket server inside it.
        this.httpServer = new HttpServer_1.HttpServer();
        // private async createDefaultData()
        // {
        //   await this.game.createDefaultWorld();
        // }
        // private async loadData()
        // {
        //   // Load the game.
        //   await this.game.load();
        // }
    }
    // private connections = new Connections();
    // private accounts = new Accounts();
    // ---------------- Protected data --------------------
    // // ~ Overrides App.entities.
    // protected entities = new ServerEntities(this.timeOfBoot);
    // // ~ Overrides App.prototypes.
    // protected prototypes = new ServerPrototypes();
    // ------------- Public static methods ----------------
    // Loads the game (or creates a new default one
    // if there is no ./data directory).
    static start(appName, version) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Application_1.Application.instance) {
                ERROR_1.ERROR(Application_1.Application.instance.constructor.name + " is already running");
                return;
            }
            let server = Application_1.Application.instance = new Server();
            // Log our name and version.
            /// TODO: Verze je ted v package.json - mela by se pri startu
            ///       serveru logovat.
            Syslog_1.Syslog.log("Starting Kosmud server...", MessageType_1.MessageType.SYSTEM_INFO);
            ///test();
            // serverApp.initClasses();
            // // We need to check if './data/' directory exists before
            // // initPrototypes() is called, because it will be created
            // // there it doesn't exist.
            // let dataExists = await FileSystem.exists(ServerApp.DATA_DIRECTORY);
            // // Create root prototype entities if they don't exist yet or load
            // // them from disk. Then recursively load all prototype entities
            // // inherited from them.
            // await this.prototypes.init();
            // // If /server/data/ directory didn't exist, create and save a new world.
            // if (!dataExists)
            //   await serverApp.createDefaultData();
            // else
            //   await serverApp.loadData();
            // Http server also starts a websocket server inside it.
            server.startHttpServer();
        });
    }
    // // -> Returns null if no message of the day is set at the moment.
    // public static getMotd(): string
    // {
    //   /// TODO: motd by se mělo savovat na disk - tj. ideálně by to
    //   /// měla být property nejaké entity (třeba config).
    //   let motd = this.instance.messageOfTheDay;
    //   if (motd === null)
    //     return "There is no message of the day at this time.";
    //   return "&gMessage of the day:\n&_" + motd;
    // }
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
    //  from /shared/lib/error/ERROR).
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
exports.Server = Server;
//# sourceMappingURL=Server.js.map