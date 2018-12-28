/*
  Part of Kosmud

  Client-side logger.
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
    const entry = Shared.Syslog.createLogEntry(messageType, message);

    console.log(entry);
  }

  // ~ Overrides Shared.Syslog.reportException().
  protected reportException(error: Error, isCaught: boolean): void
  {
    const messageType = Shared.Syslog.exceptionMessageType(isCaught);

    error.message = Shared.Syslog.createLogEntry(messageType, error.message);

    logError(error);
  }

  // ~ Overrides Shared.Syslog.reportError().
  protected reportError(message: string): void
  {
    const logEntry = Shared.Syslog.createLogEntry("[ERROR]", message);
    const error = new Error(logEntry);

    Shared.Syslog.trimStackTrace(error, ERROR);

    logError(error);
  }
}

// ----------------- Auxiliary Functions ---------------------

function logError(error: Error)
{
  // Use 'console.error()' instead of 'console.log()' because
  // it better displays stack trace (at least in Chrome).
  console.error(error);
}