/*
  Part of Kosmud

  A connection to the server.
*/

import { Syslog } from "../../Shared/Log/Syslog";
import { WebSocketEvent } from "../../Shared/Net/WebSocketEvent";
import { Types } from "../../Shared/Utils/Types";
import { Packet } from "../../Shared/Protocol/Packet";
import { Socket } from "../../Server/Net/Socket";
import { Classes } from "../../Shared/Class/Classes";
import { Connections } from "../../Server/Net/Connections";
import { SystemMessage } from "../../Server/Protocol/SystemMessage";
import { ZoneUpdate } from "../../Shared/Protocol/ZoneUpdate";
import { EnterFlightResponse } from
  "../../Shared/Protocol/EnterFlightResponse";
import { KeyboardInput } from "../../Server/Protocol/KeyboardInput";
import { MouseInput } from "../../Server/Protocol/MouseInput";
import { SetWaypoint } from "../../Server/Protocol/SetWaypoint";
import { EnterFlightRequest } from "../../Server/Protocol/EnterFlightRequest";
import { Accounts } from "../../Server/Account/Accounts";

// 3rd party modules.
// Use 'isomorphic-ws' to use the same code on both client and server.
import * as WebSocket from "isomorphic-ws";

// We need to registr packet classes here because when a module is
// imported and not used, typescript doesn't execute it's code.
Classes.registerSerializableClass(SystemMessage);
Classes.registerSerializableClass(ZoneUpdate);
Classes.registerSerializableClass(EnterFlightResponse);
Classes.registerSerializableClass(KeyboardInput);
Classes.registerSerializableClass(MouseInput);
Classes.registerSerializableClass(SetWaypoint);
Classes.registerSerializableClass(EnterFlightRequest);

export class Connection extends Socket
{
  /// TODO: Výhledově se samozřejmě bude Account vyrábět až při loginu.
  // public account: Account | "Not logged in" = "Not logged in";
  public account = Accounts.account;

  constructor(webSocket: WebSocket, ip: string, url: string)
  {
    super(webSocket, ip, url);
  }

  // ---------------- Public methods --------------------

  // ! Throws exception on error.
  public getAccount()
  {
    // if (this.account === "Not logged in")
    // {
    //   throw new Error(`User ${this.getUserInfo()}`
    //   + ` is not logged in yet`);
    // }

    return this.account;
  }

  /// Tohle by mohl být getter...
  public getUserInfo()
  {
    let info = "";

    /// Disabled for now.
    // if (this.account !== "Not attached")
    //   info += this.account.getEmail() + " ";

    // Add (url [ip]).
    info += this.getOrigin();

    return info;
  }

  // ! Throws exception on error.
  public send(packet: Packet)
  {
    // ! Throws exception on error.
    this.sendData
    (
      // ! Throws exception on error.
      packet.serialize("Send to Client")
    );
  }

  // --------------- Private methods --------------------

  // Releases the connection from memory
  // (should be called from 'onClose' event on socket).
  private release()
  {
    /// Disabled for now.
    // // It's ok if account doesn't exist here, it happens
    // // when browser has opened connection but player hasn't
    // // logged in yet or when player reconnects from different
    // // location and the old connection is closed.
    // if (this.account !== "Not attached")
    // {
    //   this.account.logout();
    //   this.account = null;
    // }

    // Release this connection from memory.
    Connections.removeConnection(this);
  }

  // ---------------- Event handlers --------------------

  // ~ Overrides Shared.Socket.onClose().
  protected onClose(event: Types.CloseEvent)
  {
    super.onClose(event);

    if (isNormalDisconnect(event))
    {
      logNormalDisconnect(this.getUserInfo(), event);
    }
    else
    {
      this.logSocketClosingError(event);
    }

    this.release();
  }
}

// ----------------- Auxiliary Functions ---------------------

function logNormalDisconnect(user: string, event: Types.CloseEvent)
{
  if (isCausedByClosingTab(event))
  {
    Syslog.log("[CONNECTION_INFO]", `User ${user} has`
      + ` disconnected by closing or reloading browser tab`);
  }
  else
  {
    Syslog.log("[CONNECTION_INFO]", `User ${user} has disconnected`);
  }
}

function isCausedByClosingTab(event: Types.CloseEvent)
{
  // 'event.reason' is checked because for some reason Chrome sometimes
  // closes webSocket with code 1006 when the tab is closed even though
  // we close() the socket manually in onBeforeUnload() handler (see
  // ClientApp.onBeforeUnload() for more details).
  return event.reason === WebSocketEvent.TAB_CLOSED;
}

function isNormalDisconnect(event: Types.CloseEvent)
{
  const isNormalClose = WebSocketEvent.isNormalClose(event.code);

  return isNormalClose || isCausedByClosingTab(event);
}