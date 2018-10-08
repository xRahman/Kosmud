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
  // ---------------- Public methods --------------------

  public getOrigin() { return "the server"; }

  // ---------------- Event handlers --------------------

  // ~ Overrides Shared.Socket.onOpen().
  protected onOpen(event: Types.OpenEvent)
  {
    super.onOpen(event);

    Syslog.log("Websocket opened", MessageType.WEBSOCKET);
  }
}