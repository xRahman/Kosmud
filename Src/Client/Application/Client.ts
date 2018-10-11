/*
  Part of Kosmud

  Client application.

  Usage:
    Client.start();
*/

import {REPORT} from '../../Shared/Log/REPORT';
import {Syslog} from '../../Client/Log/Syslog';
import {PhaserEngine} from '../../Client/Phaser/PhaserEngine';
import {Application} from '../../Shared/Application';
import {Entities} from '../../Client/Class/Entities';
import {Document} from '../../Client/Gui/Document';
import {Connection} from '../../Client/Net/Connection';

PhaserEngine;   // Inits the class.

export class Client extends Application
{
  // -------------- Static constants --------------------

  // --------------- Static accessors -------------------

  public static get document() { return this.instance.document; }
  // public static get connection() { return this.instance.connection; }

  // -------------- Static class data -------------------

  // Here we also assign Client instance to Application.instance property
  // so it will be accessible from shared code. Without this, functions
  // like ERROR() would not work because Application.instance would be
  // 'null'.
  protected static instance = Application.instance = new Client();

  // ---------------- Protected data --------------------

  protected entities = new Entities();

  // ----------------- Private data ---------------------

  // // There is only one connection per client application
  // // (it means one connection per browser tab if you
  // //  open the client in multiple tabs).
  // private connection = new Connection();

  // Html document.
  private document = new Document();

  // ------------- Public static methods ----------------

  public static async start()
  {
    Syslog.log("[INFO]", "Starting Kosmud client...");

    if (!Connection.checkWebSocketSupport())
      return;

    this.instance.initGUI();

    try
    {
      Connection.connect();
    }
    catch (error)
    {
      REPORT(error, "Failed to connect to the server");
      alert("Failed to connect to the server");
    }
  }

  // ---------------- Private methods -------------------

  private initGUI()
  {
    Connection.registerBeforeUnloadEvent();
  }

  // ---------------- Event handlers --------------------
}