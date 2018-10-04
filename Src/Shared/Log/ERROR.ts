/*
  Part of Kosmud

  Implements runtime error reporting. Use it a lot!

       --------------------------------------------------------
               EVERY ERROR() NEEDS TO BE FIXED ASAP!
               (Even if MUD doesn't crash right away)
       --------------------------------------------------------
*/

/*
  ERROR() usage example:

    import {ERROR} from '../shared/lib/error/ERROR';

    if (character === null)
    {
      ERROR("Invalid character");
    }

  Try to write error messages that explain what are the possible causes
  and available solutions.
  (At the time of writing of ERROR(), you know quite well what could go
   wrong. 5 years later, you will pay gold for any such hint, trust me.)

  Don't include name of the function where error occured. It will be added
  automatically to the stack trace.
*/

/*
  Implementation notes:
    Function ERROR() is exported directly (without encapsulating class)
  so it can be imported and called directly without the need to type
  something like ERROR.ERROR(). It is named with CAPS to diferentiate
  it from javascript Error object.
*/

import {Syslog} from '../../Shared/Log/Syslog';

export function ERROR(message: string)
{
  Syslog.reportError(message);
}
