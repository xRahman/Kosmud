/*
  Part of Kosmud

  Server-side logger.
*/

import { ERROR } from "../../Shared/Log/ERROR";
import * as Shared from "../../Shared/Log/Syslog";

export class Syslog extends Shared.Syslog
{
  // -------------- Static class data -------------------

  // Here we also assign Syslog instance to Syslog.instance property
  // so it will be accessible from shared code. Without this, functions
  // like ERROR() would not work because Syslog.instance would be
  // 'null'.
  protected static instance = Shared.Syslog.instance = new Syslog();

  // --------------- Protected methods ------------------

  // ~ Overrides Shared.Syslog.log().
  protected log(messageType: Shared.Syslog.MessageType, message: string)
  {
    const entry = Syslog.createLogEntry(messageType, message);

    // Output to stdout.
    console.log(entry);

    // Output to log file.
    /// TODO
  }

  // ~ Overrides Shared.Syslog.reportException().
  protected reportException(error: Error, isCaught: boolean): void
  {
    let message = error.message;

    message += `\n${Syslog.removeErrorMessage(error.stack)}`;

    this.log(Syslog.exceptionMessageType(isCaught), message);
  }

  // ~ Overrides Shared.Syslog.reportError().
  protected reportError(message: string): void
  {
    const stackTrace = Shared.Syslog.createTrimmedStackTrace(ERROR);
    const errorMsg = `${message}\n${stackTrace}`;

    this.log("[ERROR]", errorMsg);
  }
}