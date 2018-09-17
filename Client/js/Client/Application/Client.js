/*
  Part of Kosmud

  Implements client application.

  Usage:
    Client.start(version);
*/
define(["require", "exports", "../../Client/Phaser/PhaserTest", "../../Shared/Error/ERROR", "../../Shared/Syslog", "../../Shared/MessageType", "../../Client/Application/ClientSyslog", "../../Shared/Application"], function (require, exports, PhaserTest_1, ERROR_1, Syslog_1, MessageType_1, ClientSyslog_1, Application_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // import {Entity} from '../../../shared/lib/entity/Entity';
    // import {ClientEntities} from '../../../client/lib/entity/ClientEntities';
    // import {ClientPrototypes} from '../../../client/lib/entity/ClientPrototypes';
    // import {Document} from '../../../client/gui/Document';
    // import {Connection} from '../../../client/lib/connection/Connection';
    // import {ClientSocket} from '../../../client/lib/net/ClientSocket';
    // import {Windows} from '../../../client/gui/window/Windows';
    class Client extends Application_1.Application {
        // -------------- Static constants --------------------
        // public static readonly APP_ERROR = "Application Error";
        // --------------- Static accessors -------------------
        // public static get document() { return this.instance.document; }
        // public static get windows() { return this.instance.windows; }
        // public static get connection() { return this.instance.connection; }
        // public static get state() { return this.instance.state; }
        // -------------- Static class data -------------------
        // // ~ Overrides App.instance.
        // protected static instance = new ClientApp();
        // ---------------- Protected data --------------------
        // // ~ Overrides App.entities.
        // // Contains all entities (accounts, characters, rooms, etc.).
        // protected entities = new ClientEntities();
        // // ~ Overrides App.prototypes.
        // protected prototypes = new ClientPrototypes();
        // ----------------- Private data ---------------------
        // // There is only one connection per client application
        // // (it means one connection per browser tab if you
        // //  open the client in multiple tabs).
        // private connection = new Connection();
        // // Html document.
        // private document = new Document();
        // private windows = new Windows();
        // // Application state determines which windows are visible.
        // private state = ClientApp.State.INITIAL;
        // ------------- Public static methods ----------------
        // public static switchToState(state: ClientApp.State)
        // {
        //   if (state === ClientApp.State.INITIAL)
        //   {
        //     ERROR("Attempt to set ClientApp.state to 'INITIAL'. This can"
        //       + " only be done by implicit inicialization");
        //     return;
        //   }
        //   this.instance.state = state;
        //   this.windows.onAppChangedState(state);
        //   if (state === ClientApp.State.ERROR)
        //     alert("An error occured. Please reload the browser tab to log back in.");
        // }
        // Creates and runs an instance of ClientApp.
        static async start() {
            if (Application_1.Application.instance) {
                ERROR_1.ERROR(Application_1.Application.instance.constructor.name + " is already running");
                return;
            }
            let client = Application_1.Application.instance = new Client();
            Syslog_1.Syslog.log("Starting Kosmud client version...", MessageType_1.MessageType.SYSTEM_INFO);
            /// Test.
            client['phaserTest'] = new PhaserTest_1.PhaserTest();
            // if (!ClientSocket.checkWebSocketSupport())
            //   return;
            // clientApp.initClasses();
            // clientApp.initGUI();
            // clientApp.connection.connect();
            // clientApp.showLoginWindow();
            /// TEST:
            //ClientApp.setState(ClientApp.State.IN_GAME);
            /// TODO: Stáhnout viewport data ze serveru.
            /// I když možná nestačí connection.connect(), ještě se asi bude
            /// muset player přilogovat - aby se dalo vůbec zjistit, kde je
            /// (a tedy co se má stáhnout a renderovat).
            /// TODO: Vyrenderovat je do mapy.
            /// Možná bych se prozatím mohl vykašlat na zjišťování pozice avataru
            /// a prostě stáhnout nějaký fixní výřez (ono v něm stejně nic nebude).
            /// Jinak asi fakt budu muset udělat logovací komponenty, protože
            /// z telnet-style loginu v clientu nepoznám, že se hráč nalogoval do hry.
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
            // There is no point in 'crashing' client app, it's just
            // a web page.
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
    exports.Client = Client;
    // ------------------ Type declarations ----------------------
    // Module is exported so you can use enum type from outside this file.
    // It must be declared after the class because Typescript says so...
    var ClientApp;
    (function (ClientApp) {
        let State;
        (function (State) {
            State[State["INITIAL"] = 0] = "INITIAL";
            State[State["LOGIN"] = 1] = "LOGIN";
            State[State["REGISTER"] = 2] = "REGISTER";
            State[State["TERMS"] = 3] = "TERMS";
            State[State["CHARSELECT"] = 4] = "CHARSELECT";
            State[State["CHARGEN"] = 5] = "CHARGEN";
            State[State["IN_GAME"] = 6] = "IN_GAME";
            State[State["ERROR"] = 7] = "ERROR"; // Player is asked to reload browser tab to recover.
        })(State = ClientApp.State || (ClientApp.State = {}));
    })(ClientApp = exports.ClientApp || (exports.ClientApp = {}));
});
//# sourceMappingURL=Client.js.map