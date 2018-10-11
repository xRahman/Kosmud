/*
  Part of Kosmud

  Clisnt-side websocket wrapper.
*/

import {Syslog} from '../../Shared/Log/Syslog';
import {Types} from '../../Shared/Utils/Types';
import * as Shared from '../../Shared/Net/Socket';

export abstract class Socket extends Shared.Socket
{
  // ---------------- Static methods --------------------
  
  public static checkWebSocketSupport(): boolean
  {
    if (typeof WebSocket === 'undefined')
    {
      alert("Sorry, you browser doesn't support websockets.");
      return false;
    }

    return true;
  }

  // ---------------- Public methods --------------------

  public getOrigin() { return "the server"; }

  // ---------------- Event handlers --------------------

  // ~ Overrides Shared.Socket.onOpen().
  protected onOpen(event: Types.OpenEvent)
  {
    super.onOpen(event);

    Syslog.log("[WEBSOCKET]", "Websocket opened");
  }
}