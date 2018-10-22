/*
  Part of Kosmud

  Runtime exception reporting.
*/

/*
  IMPORTANT: Parameter of REPORT() must be an Error object.
*/

/*
  Usage example:

    import {REPORT} from 'Shared/Log/REPORT';

    try
    {
      something();
    }
    catch (error);
    {
      REPORT(error, "Something went wrong. It's not going to happen");
    }
*/

import { Syslog } from "../../Shared/Log/Syslog";
import { ERROR } from "../../Shared/Log/ERROR";

// Note: 'error' parameter has type 'any' because when you catch
//   an error, typescript has no way of knowing it's type. You still
//   need to throw instances of Error object, however - you will get
//   an error message if you don't.
export function REPORT(error: any, catchMessage?: string)
{
  if (!(error instanceof Error))
  {
    ERROR("'error' parameter passed to function REPORT() isn't"
      + " an istance of 'Error' object. Someone probably"
      + " incorrectly used 'throw " + "\"message\"" + " instead of"
      + " 'throw new Error(\"message\")'. Fix it so the stack trace"
      + " can show where the error occured rather than where it has"
      + " been caught");

    error = new Error(error);
  }

  if (catchMessage)
    error.message = `${catchMessage} (${error.message$})`;

  Syslog.reportException(error);
}
