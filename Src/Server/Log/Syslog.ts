/*
  Part of Kosmud

  Server-side logger.
*/

import {ERROR} from '../../Shared/Log/ERROR';
import {StringUtils} from '../../Shared/Utils/StringUtils';
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
    
    // Output to stdout.
    console.log(entry);

    // Output to log file.
    /// TODO
  }

  // ~ Overrides Shared.Syslog.reportException().
  protected reportException(error: Error): void
  {
    let errorMsg = error.message;

    errorMsg += "\n" + this.removeErrorMessage(error.stack);

    this.log(errorMsg, MessageType.RUNTIME_EXCEPTION);
  }

  // ~ Overrides Shared.Syslog.reportError().
  protected reportError(message: string): void
  {
    let errorMsg = message + "\n" + this.createTrimmedStackTrace(ERROR);

    this.log(errorMsg, MessageType.RUNTIME_ERROR);
  }
}