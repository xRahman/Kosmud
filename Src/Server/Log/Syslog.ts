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
  protected log(text: string, msgType: MessageType)
  {
    let entry = "[" + MessageType[msgType] + "] " + text;

    // Output to stdout.
    console.log(entry);

    // Output to log file.
    /// TODO
  }

  // ~ Overrides Shared.Syslog.reportException().
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

  // ~ Overrides Shared.Syslog.reportError().
  protected reportError(message: string): void
  {
    let errorMsg = message + "\n" + Syslog.getTrimmedStackTrace(ERROR);

    Syslog.log(errorMsg, MessageType.RUNTIME_ERROR);
  }
}