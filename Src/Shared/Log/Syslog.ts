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

import {StringUtils} from '../Utils/StringUtils';
import {REPORT} from '../../Shared/Log/REPORT';
import {MessageType} from '../../Shared/MessageType';

export abstract class Syslog
{
  // -------------- Static class data -------------------

  public static readonly STACK_IS_NOT_AVAILABLE =
    "Stack trace is not available."

  // This property needs to be inicialized in descendants.
  protected static instance: Syslog | null = null;

  // --------------- Static accessors -------------------

  // ! Throws exception on error.
  private static getInstance(): Syslog
  {
    if (!this.instance)
    {
      throw new Error
      (
        "Syslog.instance is not inicialized. It needs to be"
        + " assigned in all descendant classes."
      );
    }

    return this.instance;
  }

  // ---------------- Static methods --------------------

  // ! Throws exception on error.
  public static log(text: string, msgType: MessageType)
  {
    this.getInstance().log(text, msgType);
  }

  // ! Throws exception on error.
  public static logConnectionInfo(message: string)
  {
    this.log(message, MessageType.CONNECTION_INFO);
  }

  // ! Throws exception on error.
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
    return StringUtils.removeFirstLinesWithoutPrefix(tmpErr.stack, '    at ');
  }

  public static reportUncaughtException(error: any)
  {
    const uncaughtExceptionMessage = " (this exception has"
      + " propagated to top-level function. It needs to"
      + " be caught much deeper where the error can be"
      + " properly recovered from.)"

    if (error instanceof Error)
    {
      error.message = error.message + uncaughtExceptionMessage;
      REPORT(error);
    }
    else
    {
      REPORT(error + uncaughtExceptionMessage);
    }
  }

  // Don't call this directly, use REPORT() instead.
  public static reportException(error: Error)
  {
    // If someone tries to report exception before
    // an application instance is created (for example
    // directly from a class inicialization), we can't
    // use regular logging process.
    if (!this.instance)
      throw error;

    this.instance.reportException(error);
  }

  // Don't call this directly, use ERROR() instead.
  public static reportError(message: string): void
  {
    // If someone tries to report error before a syslog instance is created
    // (for example directly from a class inicialization), we can't use regular
    // logging process so we throw exception instead.
    if (!this.instance)
    {
      throw new Error
      (
        "ERROR() occured before application was created:"
        + ' "' + message + '"'
      );
    }

    this.instance.reportError(message);
  }

  // --------------- Protected methods ------------------

  protected abstract log(message: string, msgType: MessageType): void;
  protected abstract reportException(error: Error): void;
  protected abstract reportError(message: string): void;
}