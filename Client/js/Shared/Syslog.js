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
define(["require", "exports", "../Shared/REPORT", "../Shared/Application", "../Shared/MessageType"], function (require, exports, REPORT_1, Application_1, MessageType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Syslog {
        static log(text, msgType) {
            Application_1.Application.log(text, msgType);
        }
        static logConnectionInfo(message) {
            this.log(message, MessageType_1.MessageType.CONNECTION_INFO);
        }
        static logSystemInfo(message) {
            this.log(message, MessageType_1.MessageType.SYSTEM_INFO);
        }
        // Reads stack trace from Error() object.
        // -> Returns string containing stack trace with first two lines trimmed.
        static getTrimmedStackTrace() {
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
        static reportUncaughtException(error) {
            const additionalMessage = "(ADDITIONAL ERROR: An exception"
                + " has propagated to top-level function. It needs to be"
                + " caught much deeper where the error can be properly"
                + " recovered from.)";
            if (error instanceof Error) {
                error.message = error.message + '\n' + additionalMessage;
                REPORT_1.REPORT(error);
            }
            else {
                REPORT_1.REPORT(error + '\n' + additionalMessage);
            }
        }
    }
    Syslog.STACK_IS_NOT_AVAILABLE = "Stack trace is not available.";
    exports.Syslog = Syslog;
});
//# sourceMappingURL=Syslog.js.map