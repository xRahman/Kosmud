/*
  Part of Kosmud

  Server application.

  Usage:
    Server.start(appName, version);
*/

import {StringUtils} from '../../Shared/StringUtils';
import {Application} from '../../Shared/Application';
import {ERROR} from '../../Shared/Log/ERROR';
import {Syslog} from '../../Shared/Log/Syslog';
import {ServerSyslog} from '../Log/ServerSyslog';
import {Entities} from '../../Server/Class/Entities';
import {MessageType} from '../../Shared/MessageType';
import {HttpServer} from '../../Server/Net/HttpServer';
import {Game} from '../../Server/Game/Game';

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

  // ~ Overrides App.reportException().
  protected reportException(error: Error): void
  {
    let errorMsg = error.message;

    if (error.stack)
    {
      // Stack trace for some reason starts with error message
      // prefixed with 'Error' which is confusing in the log.
      //   To remove it, we trim lines not starting with '    at '.
      // That's because error message can be multi-line so removing
      // just 1 line would not always be enough.
      let trimmedStack = StringUtils.removeFirstLinesWithoutPrefix
      (
        error.stack,
        '    at '
      );

      errorMsg += "\n" + trimmedStack;
    }
    else
    {
      errorMsg += "\n" + Syslog.STACK_IS_NOT_AVAILABLE;
    }

    Syslog.log(errorMsg, MessageType.RUNTIME_EXCEPTION);
  }

  // ~ Overrides App.reportError().
  protected reportError(message: string): void
  {
    let errorMsg = message + "\n" + Syslog.getTrimmedStackTrace(ERROR);

    Syslog.log(errorMsg, MessageType.RUNTIME_ERROR);
  }

  // ~ Overrides App.log().
  // Logs the message and sends it to all online
  // admins with sufficient 'adminLevel'.
  protected log(message: string, msgType: MessageType): void
  {
    ServerSyslog.log(message, msgType);
  }

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
