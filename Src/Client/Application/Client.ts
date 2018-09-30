/*
  Part of Kosmud

  Client application.

  Usage:
    Client.start();
*/

import {PhaserEngine} from '../Phaser/PhaserEngine';
import {Application} from '../../Shared/Application';
import {MessageType} from '../../Shared/MessageType';
import {Syslog} from '../../Shared/Syslog';
import {ClientSyslog} from '../../Client/Application/ClientSyslog';
import {Entities} from '../../Client/Class/Entities';
import {Document} from '../../Client/Gui/Document';
import {Connection} from '../../Client/Net/Connection';
import {WebSocketEvent} from '../../Shared/Net/WebSocketEvent';

PhaserEngine;   // Inits the class.

export class Client extends Application
{
  // -------------- Static constants --------------------

  // --------------- Static accessors -------------------

  public static get document() { return this.instance.document; }
  public static get connection() { return this.instance.connection; }

  // -------------- Static class data -------------------

  // Here we also assign Client instance to Application.instance property
  // so it will be accessible from shared code. Without this, functions
  // like ERROR() would not work because Application.instance would be
  // 'null'.
  protected static instance = Application.instance = new Client();

  // ---------------- Protected data --------------------

  protected entities = new Entities();

  // ----------------- Private data ---------------------

  // There is only one connection per client application
  // (it means one connection per browser tab if you
  //  open the client in multiple tabs).
  private connection = new Connection();

  // Html document.
  private document = new Document();

  // ------------- Public static methods ----------------

  public static async start()
  {
    Syslog.log("Starting Kosmud client...", MessageType.SYSTEM_INFO);

    Client.instance.initGUI();
    Client.instance.connection.connect();
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
    // There is no point in 'crashing' the client, it's just
    // a web page. So we just report the error.
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

  private initGUI()
  {
    window.onbeforeunload =
      (event: BeforeUnloadEvent) => { this.onBeforeUnload(event); }
  }

  // ---------------- Event handlers --------------------

  private onBeforeUnload(event: BeforeUnloadEvent)
  {
    this.connection.reportClosingBrowserTab();

    // Close the connection to prevent browser from closing it
    // abnormally with event code 1006.
    //   For some strange reson this doesn't alway work in Chrome.
    // If we call socket.close(1000, "Tab closed"), onClose() event
    // handler on respective server socket will receive the reason
    // but sometimes code will be 1006 instead of 1000. To circumvent
    // this, we send WebSocketEvent.REASON_CLOSE when socket is closed
    // from onBeforeUnload() and we check for it in ServerSocket.onClose().
    this.connection.close(WebSocketEvent.TAB_CLOSED);
  }
}

// ------------------ Type declarations ----------------------