/*
  Part of Kosmud

  Clisnt-side websocket wrapper.
*/

import { Syslog } from "../../Shared/Log/Syslog";
import { Types } from "../../Shared/Utils/Types";
import * as Shared from "../../Shared/Net/Socket";

export abstract class Socket extends Shared.Socket
{
  // ---------------- Static methods --------------------

  protected static browserSupportsWebSockets(): boolean
  {
    return typeof WebSocket !== "undefined";
  }

  // ---------------- Public methods --------------------

  // tslint:disable-next-line:prefer-function-over-method
  public getOrigin() { return "the server"; }

  // ---------------- Event handlers --------------------

  // ~ Overrides Shared.Socket.onOpen().
  protected onOpen(event: Types.OpenEvent)
  {
    super.onOpen(event);

    Syslog.log("[WEBSOCKET]", "Websocket opened");
  }
}