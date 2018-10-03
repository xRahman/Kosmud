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

//import {Utils} from '../../../shared/lib/utils/Utils';
import {Application} from '../Shared/Application';
import { Syslog } from './Syslog';
import { ERROR } from './ERROR';

// Note: 'error' parameter has type 'any' because when you catch
// an error, typescript has no way of knowing it's type. You still
// need to throw instances of Error object, however - you will get
// an error message if you don't.
export function REPORT(error: any, catchMessage?: string)
{
  if (!(error instanceof Error))
  {
    ERROR("'error' parameter passed to function REPORT() isn't"
      + " an istance of 'Error' object. Someone probably"
      + " incorrectly used 'throw " + '"message"' + " instead of"
      + " 'throw new Error(\"message\")'. Fix it so the stack trace"
      + " can show where the error occured rather than where it has"
      + " been caught");

    // Create a new Error object with 'error' parameter as it's message.
    error = new Error(error);
  }

  // if (catchMessage)
  //   error.message += "\n(CATCH MESSAGE): " + catchMessage;

  // Add a 'isReported' property to Error object.
  // (It will prevent Syslog.reportUncaughtException() to report
  //  this error again).
  error[Syslog.IS_REPORTED] = true;

  Application.reportException(error);
  Application.reportCaughtException(new Error(catchMessage));
}
