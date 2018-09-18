/*
  Part of Kosmud

  Implements client application.

  Usage:
    Client.start(version);
*/

import {PhaserTest} from '../../Client/Phaser/PhaserTest';

import {ERROR} from '../../Shared/Error/ERROR';
// import {FATAL_ERROR} from '../../../shared/lib/error/FATAL_ERROR';
import {Syslog} from '../../Shared/Syslog';
import {MessageType} from '../../Shared/MessageType';
import {ClientSyslog} from '../../Client/Application/ClientSyslog';
// import {WebSocketEvent} from '../../../shared/lib/net/WebSocketEvent';
import {Application} from '../../Shared/Application';
// import {Entity} from '../../../shared/lib/entity/Entity';
// import {ClientEntities} from '../../../client/lib/entity/ClientEntities';
// import {ClientPrototypes} from '../../../client/lib/entity/ClientPrototypes';
import {Document} from '../../Client/Gui/Document';
// import {Connection} from '../../../client/lib/connection/Connection';
// import {ClientSocket} from '../../../client/lib/net/ClientSocket';
// import {Windows} from '../../../client/gui/window/Windows';

export class Client extends Application
{
  // -------------- Static constants --------------------

  // public static readonly APP_ERROR = "Application Error";

  // --------------- Static accessors -------------------

  public static get document() { return this.instance.document; }
  // public static get windows() { return this.instance.windows; }
  // public static get connection() { return this.instance.connection; }
  // public static get state() { return this.instance.state; }

  // -------------- Static class data -------------------

  // Here we also assign Client instance to Application.instance property
  // so it will be accessible from shared code. Without this, functions
  // like ERROR() would not work because Application.instance would be
  // 'null'.
  protected static instance = Application.instance = new Client();

  // ---------------- Protected data --------------------

  // // ~ Overrides App.entities.
  // // Contains all entities (accounts, characters, rooms, etc.).
  // protected entities = new ClientEntities();

  // // ~ Overrides App.prototypes.
  // protected prototypes = new ClientPrototypes();

  // ----------------- Private data ---------------------

  /// Test.
  private phaserTest = new PhaserTest();

  // // There is only one connection per client application
  // // (it means one connection per browser tab if you
  // //  open the client in multiple tabs).
  // private connection = new Connection();

  // Html document.
  private document = new Document();

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

  public static async start()
  {
    Syslog.log("Starting Kosmud client version...", MessageType.SYSTEM_INFO);

    // if (!ClientSocket.checkWebSocketSupport())
    //   return;

    // this.instance.initClasses();
    // this.instance.initGUI();

    // this.instance.connection.connect();

    // this.instance.showLoginWindow();
    
    /// TEST:
    //Client.setState(Client.State.IN_GAME);
  }

  // --------------- Protected methods ------------------

  // ~ Overrides App.reportException().
  protected reportException(error: Error): void
  {
    this.report(error);
  }

  // ~ Overrides App.reportError().
  protected reportError(message: string): void
  {
    this.report(new Error(message));
  }

  // ~ Overrides App.reportFatalError().
  protected reportFatalError(message: string): void
  {
    // There is no point in 'crashing' client app, it's just
    // a web page.
    this.report(new Error(message));
  }

  // ~ Overrides App.log().
  protected log(message: string, msgType: MessageType): void
  {
    ClientSyslog.log(message, msgType);
  }

  // ---------------- Private methods -------------------

  protected report(error: Error): void
  {
    // Throw an error instead of reporting to the console
    // because this way Chrome prints out stack trace using
    // source maps (so in .ts files) rathen than in .js files
    // (which is not so useful).
    throw error;
  }

  // private registerBeforeUnloadHandler()
  // {
  //   window.onbeforeunload =
  //     (event: BeforeUnloadEvent) => { this.onBeforeUnload(event); }
  // }

  // private initGUI()
  // {
  //   this.registerBeforeUnloadHandler();

  //   this.windows.createStandaloneWindows();

  //   /// Tohle by se asi mělo vytvářet až po přilogování.
  //   /// - nakonec ne. Bude jen jedno map window na clientApp,
  //   ///   jeho obsah se bude překreslovat podle aktivního charu.
  //   this.windows.createMapWindow();
  // }

  // private showLoginWindow()
  // {
  //   ClientApp.switchToState(ClientApp.State.LOGIN);
  // }

  // ---------------- Event handlers --------------------

  // private onBeforeUnload(event: BeforeUnloadEvent)
  // {
  //   this.connection.reportClosingBrowserTab();

  //   // Close the connection to prevent browser from closing it
  //   // abnormally with event code 1006.
  //   //   For some strange reson this doesn't alway work in Chrome.
  //   // If we call socket.close(1000, "Tab closed"), onClose() event
  //   // handler on respective server socket will receive the reason
  //   // but sometimes code will be 1006 instead of 1000. To circumvent
  //   // this, we send WebSocketEvent.REASON_CLOSE when socket is closed
  //   // from onBeforeUnload() and we check for it in ServerSocket.onClose().
  //   this.connection.close(WebSocketEvent.TAB_CLOSED);
  // }
}

// ------------------ Type declarations ----------------------

// // Module is exported so you can use enum type from outside this file.
// // It must be declared after the class because Typescript says so...
// export module ClientApp
// {
//   export enum State
//   {
//     INITIAL,
//     LOGIN,
//     REGISTER,
//     TERMS,
//     CHARSELECT,
//     CHARGEN,
//     IN_GAME,
//     ERROR   // Player is asked to reload browser tab to recover.
//   }
// }