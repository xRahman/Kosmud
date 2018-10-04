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
    let entry = "[" + MessageType[msgType] + "] " + message;

    // Output to debug console.
    console.log(entry);
  }

    // ~ Overrides Shared.Syslog.reportException().
  protected reportException(error: Error): void
  {
    console.error(error);
  }

  // ~ Overrides Shared.Syslog.reportError().
  protected reportError(message: string): void
  {
    let err = new Error(message);

    // Trim lines from the top of stack trace up to and including
    // function ERROR() to show where the error really happened.
    Error.captureStackTrace(err, ERROR);

    // Use 'console.error()' instead of 'console.log()' because it
    // better displays stack trace (at least in Chrome).
    console.error(err);
  }
}