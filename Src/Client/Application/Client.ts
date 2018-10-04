/*
  Part of Kosmud

  Client application.

  Usage:
    Client.start();
*/

import {Syslog} from '../../Shared/Log/Syslog';
import {PhaserEngine} from '../Phaser/PhaserEngine';
import {Application} from '../../Shared/Application';
import {MessageType} from '../../Shared/MessageType';
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

    /// TEST:
    try
    {
      Client.instance.initGUI();
    }
    catch (error)
    {
      Syslog.reportUncaughtException(error);
    }

    // Client.instance.initGUI();
    Client.instance.connection.connect();
  }

  // --------------- Protected methods ------------------

  // ---------------- Private methods -------------------

  private initGUI()
  {
    /// TEST:
    // ERROR("Test error");
    // REPORT(new Error("Test report"), "test catch message");
    // throw new Error("Test exception");

    window.onbeforeunload =
      (event: BeforeUnloadEvent) => { this.onBeforeUnload(event); }
  }

  // ---------------- Event handlers --------------------

  /// Tohle by mělo bejt někde jinde (v Document asi?)
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