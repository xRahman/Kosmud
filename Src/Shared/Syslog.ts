/*
  Part of BrutusNEXT

  Implements logger.

  Usage example:

    import {MessageType} from '../shared/lib/message/MessageType';
    import {AdminLevels} from '../shared/lib/admin/AdminLevels';
    import {Syslog} from '../shared/lib/log/Syslog';

    Syslog.log
    (
      "Loading mobile data...",
      MessageType.SYSTEM,
      AdminLevels.CREATOR
    );
*/

import {removeFirstLinesWithoutPrefix} from '../Shared/StringUtils';
import {REPORT} from '../Shared/REPORT';
import {Application} from '../Shared/Application';
import {MessageType} from '../Shared/MessageType';

export class Syslog
{
  public static readonly IS_REPORTED = 'isReported';

  public static readonly STACK_IS_NOT_AVAILABLE =
    "Stack trace is not available."

  public static log(text: string, msgType: MessageType)
  {
    Application.log(text, msgType);
  }

  public static logConnectionInfo(message: string)
  {
    this.log(message, MessageType.CONNECTION_INFO);
  }

  public static logSystemInfo(message: string)
  {
    this.log(message, MessageType.SYSTEM_INFO);
  }

  // Reads stack trace from Error() object.
  // -> Returns string containing stack trace with first two lines trimmed.
  public static getTrimmedStackTrace(stackTop?: Function): string
  {
    // Create a temporary error object to construct stack trace for us.
    let tmpErr = new Error();

    if (Error.captureStackTrace)
      // Second parameter removes from stack trace everything
      // above 'stackTop' function (so the user sees where the
      // ERROR actualy originated).
      Error.captureStackTrace(tmpErr, stackTop);

    if (!tmpErr.stack)
      return Syslog.STACK_IS_NOT_AVAILABLE;

    // Stack trace for some reason starts with error message
    // prefixed with 'Error' which is confusing in the log.
    //   To remove it, we trim lines not starting with '    at '.
    // That's because error message can be multi-line so removing
    // just 1 line would not always be enough.
    return removeFirstLinesWithoutPrefix(tmpErr.stack, '    at ');
  }

  public static reportUncaughtException(error: any)
  {
    // Check if there is 'isReported = true' property set on
    // error object. It means that this error has already been
    // reported by REPORT(). Already reported exception can get
    // here because on the client we throw a new exception
    // instead of logging the error because it better shows
    // stack trace to the user.
    if (error && (error as any)[Syslog.IS_REPORTED] === true)
      return;

    const uncaughtExceptionMessage = "An exception has"
      + " propagated to top-level function. It needs to"
      + " be caught much deeper where the error can be"
      + " properly recovered from. The exception is:"

    if (error instanceof Error)
    {
      error.message = uncaughtExceptionMessage + "\n" + error.message;
      REPORT(error);
    }
    else
    {
      REPORT(uncaughtExceptionMessage + "\n" + error);
    }
  }
}