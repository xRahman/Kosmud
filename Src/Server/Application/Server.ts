/*
  Part of Kosmud

  Server application.

  Usage:
    Server.start(appName, version);
*/

import {Application} from '../../Shared/Application';
import {ERROR} from '../../Shared/Error/ERROR';
import {Syslog} from '../../Shared/Syslog';
import {ServerSyslog} from '../../Server/Application/ServerSyslog';
import {MessageType} from '../../Shared/MessageType';
import {HttpServer} from '../../server/Net/HttpServer';

export class Server extends Application
{
  // -------------- Static constants --------------------

  // --------------- Static accessors -------------------

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

  // ------------- Public static methods ----------------

  public static async start(appName: string, version: string)
  {
    Syslog.log
    (
      "Starting " + appName + " server (v" + version + ")...",
      MessageType.SYSTEM_INFO
    );

    // Http server also starts a websocket server inside it.
    this.instance.startHttpServer();
  }

  // --------------- Protected methods ------------------

  // ~ Overrides App.reportException().
  protected reportException(error: Error): void
  {
    let errorMsg = error.message + "\n";

    if (error.stack)
      errorMsg += error.stack;
    else
      errorMsg += Syslog.STACK_IS_NOT_AVAILABLE;

    Syslog.log(errorMsg, MessageType.RUNTIME_EXCEPTION);
  }

  // ~ Overrides App.reportError().
  protected reportError(message: string): void
  {
    let stackTrace = Syslog.getTrimmedStackTrace();

    let errorMsg = message;
    
    if (stackTrace)
      errorMsg += "\n" + Syslog.getTrimmedStackTrace();

    Syslog.log(errorMsg, MessageType.RUNTIME_ERROR);
  }

  // ~ Overrides App.reportFatalError().
  // Reports error message and stack trace and terminates the program.
  // (Don't call this method directly, use FATAL_ERROR()
  //  from /Shared/Error/ERROR).
  protected reportFatalError(message: string): void
  {
    let errorMsg = message + "\n"
      + Syslog.getTrimmedStackTrace();

    Syslog.log(errorMsg, MessageType.FATAL_RUNTIME_ERROR);

    // Because promises are eating exceptions, throwing an error won't stop
    // the program if FATAL_ERROR() is called from within asynchronous method.
    // So we rather print stack trace ourselves (using Syslog.log() above)
    // and exit the program manually.
    process.exit(1);
  }

  // ~ Overrides App.log().
  // Logs the message and sends it to all online
  // admins with sufficient 'adminLevel'.
  protected log(message: string, msgType: MessageType): void
  {
    ServerSyslog.log(message, msgType);
  }

  // --------------- Private methods --------------------

  private startHttpServer()
  {
    if (this.httpServer.isOpen())
    {
      ERROR("Http server is already running");
      return;
    }

    this.httpServer.start();
  }
}
