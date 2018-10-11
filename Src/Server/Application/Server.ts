/*
  Part of Kosmud

  Server application.

  Usage:
    Server.start(appName, version);
*/

import {Syslog} from '../../Shared/Log/Syslog';
import {Entities} from '../../Server/Class/Entities';
import {HttpsServer} from '../../Server/Net/HttpsServer';
import {Game} from '../../Server/Game/Game';
import {Application} from '../../Shared/Application';
import { REPORT } from '../../Shared/Log/REPORT';

// // Force module execution:
// import '../../Server/Game/Game';

export class Server extends Application
{
  // -------------- Static constants --------------------

  // --------------- Static accessors -------------------

  // -------------- Static class data -------------------

  // Here we also assign Client instance to Application.instance property
  // so it will be accessible from shared code. Without this, functions
  // like ERROR() would not work because Application.instance would be
  // 'null'.
  protected static instance = Application.instance = new Server();

  // ----------------- Private data ---------------------

  /// Http server also runs a websocket server inside it.
  private httpsServer = new HttpsServer();

  // ---------------- Protected data --------------------

  protected entities = new Entities();

  // ----------------- Private data ---------------------

  // ------------- Public static methods ----------------

  public static async start(appName: string, version: string)
  {
    Syslog.log("[INFO]", "Starting " + appName
      + " server (v" + version + ")...");

    try
    {
      // Http server also starts a websocket server inside it.
      await this.instance.startHttpsServer();
    }
    catch (error)
    {
      REPORT(error, "Failed to start http server");
      return;
    }

    // Start the game loop.
    Game.start();
  }

  // --------------- Protected methods ------------------


  // --------------- Private methods --------------------

  // ! Throws an exception on error.
  private async startHttpsServer()
  {
    await this.httpsServer.start();
  }
}
