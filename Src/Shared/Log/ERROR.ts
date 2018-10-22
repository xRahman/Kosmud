/*
  Part of Kosmud

  Runtime error reporting.

       --------------------------------------------------------
               EVERY ERROR() NEEDS TO BE FIXED ASAP!
           (Even if application doesn't crash right away)
       --------------------------------------------------------
*/

/*
  Usage example:

    import {ERROR} from 'Shared/Log/ERROR';

    if (damage > MAX_DAMAGE)
    {
      ERROR("Damage (" + damage + ") exceeds allowed maximum");
      damage = MAX_DAMAGE;
    }

  Notes:
    If you need to return from the function after reporting an error,
    throw an exception instead of using ERROR(). ERROR() should only
    be used if you want to log something that you can immediately
    recover from.

    Try to write error messages that explain what are the possible causes
    and available solutions.
    (At the time of writing of ERROR(), you know quite well what could go
    wrong. 5 years later, you will pay gold for any such hint, trust me.)

    Don't include name of the function where error occured. Stack trace is
    added automatically to the log message.
*/

import { Syslog } from "../../Shared/Log/Syslog";

export function ERROR(message: string)
{
  Syslog.reportError(message);
}
