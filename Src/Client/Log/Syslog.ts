/*
  Part of Kosmud

  Client-side logger.
*/

import {ERROR} from '../../Shared/Log/ERROR';
import {MessageType} from '../../Shared/MessageType';
import * as Shared from '../../Shared/Log/Syslog';

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
  protected log(message: string, msgType: MessageType)
  {
    let entry = this.createLogEntry(message, msgType);

    console.log(entry);
  }

  // ~ Overrides Shared.Syslog.reportException().
  protected reportException(error: Error): void
  {
    error.message = this.createLogEntry
    (
      error.message,
      MessageType.RUNTIME_EXCEPTION
    );

    logError(error);
  }

  // ~ Overrides Shared.Syslog.reportError().
  protected reportError(message: string): void
  {
    let error = new Error
    (
      this.createLogEntry(message, MessageType.RUNTIME_ERROR)
    );

    this.trimStackTrace(error, ERROR);

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