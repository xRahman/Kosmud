/*
  Part of Kosmud

  Abstract shared ancestor of loggers.
*/

import {StringUtils} from '../Utils/StringUtils';
import {REPORT} from '../../Shared/Log/REPORT';
import {MessageType} from '../../Shared/MessageType';

export abstract class Syslog
{
  // -------------- Static class data -------------------

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

  public static reportUncaughtException(error: any)
  {
    const uncaughtExceptionMessage = " (this exception has"
      + " propagated to top-level function. It needs to"
      + " be caught much deeper where the error can be"
      + " properly recovered from.)"

    if (error instanceof Error)
    {
      error.message = error.message + uncaughtExceptionMessage;
      this.reportException(error, false);
    }
    else
    {
      this.reportException(new Error(error + uncaughtExceptionMessage), false);
    }
  }

  // Don't call this directly, use REPORT() instead.
  public static reportException(error: Error, isCaught = true)
  {
    // If someone tries to report exception before
    // an application instance is created (for example
    // directly from a class inicialization), we can't
    // use regular logging process.
    if (!this.instance)
      throw error;

    this.instance.reportException(error, isCaught);
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
  protected abstract reportException(error: Error, isCaught: boolean): void;
  protected abstract reportError(message: string): void;

  protected createTrimmedStackTrace(stackTop?: Function): string
  {
    // Create a temporary error object to construct stack trace for us.
    let tmpErr = new Error();

    tmpErr = this.trimStackTrace(tmpErr, stackTop);

    return this.removeErrorMessage(tmpErr.stack);
  }

  protected trimStackTrace(error: Error, stackTop?: Function): Error
  {
     if (Error.captureStackTrace)
      Error.captureStackTrace(error, stackTop);

    return error;
  }

  protected removeErrorMessage(stackTrace?: string)
  {
    if (!stackTrace)
      return "Stack trace is not available.";

    // Stack trace for some reason starts with error message
    // prefixed with 'Error' which is confusing in the log.
    //   To remove it, we trim lines not starting with '    at '.
    // That's because error message can be multi-line so removing
    // just 1 line would not always be enough.
    return StringUtils.removeFirstLinesWithoutPrefix(stackTrace, '    at ');
  }

  protected createLogEntry(message: string, msgType: MessageType)
  {
    return "[" + MessageType[msgType] + "] " + message;
  }

  protected exceptionMessageType(isCaught: boolean)
  {
    if (isCaught)
    {
      return MessageType.RUNTIME_EXCEPTION;
    }
    else
    {
      return MessageType.UNCAUGHT_EXCEPTION;
    }
  }
}