/*
  Part of Kosmud

  Server application.

  Usage:
    Server.start(appName, version);
*/


import {ERROR} from '../../Shared/Log/ERROR';
import {Syslog} from '../../Shared/Log/Syslog';
import {Entities} from '../../Server/Class/Entities';
import {MessageType} from '../../Shared/MessageType';
import {HttpServer} from '../../Server/Net/HttpServer';
import {Game} from '../../Server/Game/Game';
import {Application} from '../../Shared/Application';

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
  private httpServer = new HttpServer();

  // ---------------- Protected data --------------------

  protected entities = new Entities();

  // ----------------- Private data ---------------------

  // ------------- Public static methods ----------------

  public static async start(appName: string, version: string)
  {
    Syslog.log
    (
      "Starting " + appName + " server (v" + version + ")...",
      MessageType.SYSTEM_INFO
    );

    // Http server also starts a websocket server inside it.
    await this.instance.startHttpServer();

    // Start the game loop.
    Game.start();
  }

  // --------------- Protected methods ------------------


  // --------------- Private methods --------------------

  private async startHttpServer()
  {
    if (this.httpServer.isOpen())
    {
      ERROR("Http server is already running");
      return;
    }

    await this.httpServer.start();
  }
}
