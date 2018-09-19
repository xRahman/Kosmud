/*
  Part of Kosmud

  Client application.

  Usage:
    Client.start();
*/

import {PhaserTest} from '../../Client/Phaser/PhaserTest';

import {Application} from '../../Shared/Application';
import {MessageType} from '../../Shared/MessageType';
import {Syslog} from '../../Shared/Syslog';
import {ClientSyslog} from '../../Client/Application/ClientSyslog';
import {Document} from '../../Client/Gui/Document';


export class Client extends Application
{
  // -------------- Static constants --------------------

  // --------------- Static accessors -------------------

  public static get document() { return this.instance.document; }

  // -------------- Static class data -------------------

  // Here we also assign Client instance to Application.instance property
  // so it will be accessible from shared code. Without this, functions
  // like ERROR() would not work because Application.instance would be
  // 'null'.
  protected static instance = Application.instance = new Client();

  // ---------------- Protected data --------------------

  // ----------------- Private data ---------------------

  /// Test.
  private phaserTest = new PhaserTest();

  // Html document.
  private document = new Document();

  // ------------- Public static methods ----------------

  public static async start()
  {
    Syslog.log("Starting Kosmud client version...", MessageType.SYSTEM_INFO);
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

  // ---------------- Event handlers --------------------
}

// ------------------ Type declarations ----------------------