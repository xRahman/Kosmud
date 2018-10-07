/*
  Part of Kosmud

  Clisnt-side websocket wrapper.
*/


import {Syslog} from '../../Shared/Log/Syslog';
import {MessageType} from '../../Shared/MessageType';
import {Types} from '../../Shared/Utils/Types';
import * as Shared from '../../Shared/Net/Socket';

export class Socket extends Shared.Socket
{
  // ---------------- Static methods --------------------

  // -------------- Static class data -------------------

  // ----------------- Private data ---------------------

  // ----------------- Public data ----------------------

  //public connection: (Connection | null) = null;

  // ---------------- Public methods --------------------

  public getOrigin() { return "the server"; }

  // ---------------- Private methods -------------------

  // ---------------- Event handlers --------------------

//*
  // ~ Overrides Shared.Socket.onOpen().
  protected onOpen(event: Types.OpenEvent)
  {
    super.onOpen(event);

    Syslog.log("Websocket opened", MessageType.WEBSOCKET);
  }

  // -------------- Protected methods -------------------

}