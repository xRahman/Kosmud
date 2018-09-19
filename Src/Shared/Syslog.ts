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

import {REPORT} from '../Shared/REPORT';
import {Application} from '../Shared/Application';
import {MessageType} from '../Shared/MessageType';

export class Syslog
{
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
  public static getTrimmedStackTrace(): string
  {
    const TRIM_VALUE = 5;

    // Create a temporary error object to construct stack trace for us.
    let tmpErr = new Error();

    if (!tmpErr || !tmpErr.stack)
      return Syslog.STACK_IS_NOT_AVAILABLE;

    // Break stack trace string into an array of lines.
    let stackTrace = tmpErr.stack.split('\n');
    
    // Remove number of lines equal to 'trimValue' from the top of the
    // stack to ensure that stack starts at the line where error actually
    // occured.
    stackTrace.splice(0, TRIM_VALUE);

    // Join the array back to a single multi-line string.
    return stackTrace.join('\n');
  }

  public static reportUncaughtException(error: any)
  {
    const additionalMessage = "(ADDITIONAL ERROR: An exception"
      + " has propagated to top-level function. It needs to be"
      + " caught much deeper where the error can be properly"
      + " recovered from.)"

    if (error instanceof Error)
    {
      error.message = error.message + '\n' + additionalMessage;
      REPORT(error);
    }
    else
    {
      REPORT(error + '\n' + additionalMessage);
    }
  }
}
