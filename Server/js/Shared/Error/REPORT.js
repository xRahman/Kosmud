/*
  Part of BrutusNEXT

  Implements runtime exception reporting.
*/
/*
  IMPORTANT: Parameter of RERPORT() must be an Error object.

  Typical usage:

    import {REPORT} from '../shared/lib/error/REPORT';

    try
    {
      something();
    }
    catch (error);
    {
      REPORT(error, "Something went wrong. It's not going to happen");
    }

  First parameter is of type 'any' because typescript doesn't know type of
  'error' variable when the error is caught, but it should be an instance
  of Error object. If it's not, you will get an additional error message.

   Second parameter is optional. It can be used to describe consequences
   of the error.
*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
//import {Utils} from '../../../shared/lib/utils/Utils';
const Application_1 = require("../../Shared/Application");
// Note: 'error' parameter has type 'any' because when you catch
// an error, typescript has no way of knowing it's type. You still
// need to throw instances of Error object, however - you will get
// an error message if you don't.
function REPORT(error, catchMessage) {
    let origMessage;
    let additionalMessage = "";
    if (error instanceof Error) {
        origMessage = error.message;
    }
    else {
        origMessage = "" + error; // Convert 'error' parameter to string;
        error = new Error();
        additionalMessage = +"(ADDITIONAL ERROR): 'error' parameter"
            + " passed to function REPORT() isn't an istance of 'Error'"
            + " object. Someone probably incorrectly used 'throw \"message\"'"
            + " instead of 'throw new Error(\"message\")'. Please fix it to"
            + " have stack trace show where the error occured rather than"
            + " where it has been caught";
    }
    error.message = '[EXCEPTION]: ' + origMessage;
    if (catchMessage)
        error.message += '\n' + "(CATCH MESSAGE):" + catchMessage;
    if (additionalMessage !== "")
        error.message += '\n' + additionalMessage;
    Application_1.Application.reportException(error);
}
exports.REPORT = REPORT;
//# sourceMappingURL=REPORT.js.map