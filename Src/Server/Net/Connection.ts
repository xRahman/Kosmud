/*  Part of Kosmud  */

import { Syslog } from "../../Shared/Log/Syslog";
import { WebSocketEvent } from "../../Shared/Net/WebSocketEvent";
import { Types } from "../../Shared/Utils/Types";
import { Packet } from "../../Shared/Protocol/Packet";
import { ClassFactory } from "../../Shared/Class/ClassFactory";
import { Connections } from "../../Server/Net/Connections";
import { Player } from "../../Server/Game/Player";
import { SystemMessage } from "../../Server/Protocol/SystemMessage";
import { ZoneUpdate } from "../../Shared/Protocol/ZoneUpdate";
import { EnterFlightResponse } from
  "../../Shared/Protocol/EnterFlightResponse";
import { KeyboardInput } from "../../Server/Protocol/KeyboardInput";
import { MouseInput } from "../../Server/Protocol/MouseInput";
import { SetWaypoint } from "../../Server/Protocol/SetWaypoint";
import { EnterFlightRequest } from "../../Server/Protocol/EnterFlightRequest";
import { LoginRequest } from "../../Server/Protocol/LoginRequest";
import { LoginResponse } from "../../Shared/Protocol/LoginResponse";
import * as Shared from "../../Shared/Net/Connection";

// 3rd party modules.
// Use 'isomorphic-ws' to use the same code on both client and server.
import * as WebSocket from "isomorphic-ws";

// Register prototypes of packet classes.
ClassFactory.registerClassPrototype(SystemMessage);
ClassFactory.registerClassPrototype(ZoneUpdate);
ClassFactory.registerClassPrototype(EnterFlightResponse);
ClassFactory.registerClassPrototype(KeyboardInput);
ClassFactory.registerClassPrototype(MouseInput);
ClassFactory.registerClassPrototype(SetWaypoint);
ClassFactory.registerClassPrototype(EnterFlightRequest);
ClassFactory.registerClassPrototype(LoginRequest);
ClassFactory.registerClassPrototype(LoginResponse);

export class Connection extends Shared.Connection<Player>
{
  constructor
  (
    webSocket: WebSocket,
    private readonly ip: string,
    private readonly url: string
  )
  {
    super(webSocket);
  }

  // ---------------- Public methods --------------------

  // // ! Throws exception on error.
  // // ~ Overrides Shared.Connection.getPlayer.
  // public getPlayer(): Player
  // {
  //   return super.getPlayer().dynamicCast(Player);
  // }

  public getIpAddress(): string
  {
    return this.ip;
  }

  public getOrigin()
  {
    return `(${this.url} [${this.ip}])`;
  }

  // ~ Overrides Shared.Connection.getPlayerInfo().
  public getPlayerInfo()
  {
    let info = "";

    /// Disabled for now.
    // if (this.isLoggedIn())
    //   info += this.getPlayer().getEmail() + " ";

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
      packet.serialize("Send to client")
    );
  }

  // ! Throws exception on error.
  public updateClient()
  {
    if (this.isLoggedIn())
    {
      // ! Throws exception on error.
      const update = this.getPlayer().getClientUpdate();

      if (update !== "No update")
        this.send(update);
    }
  }

  // --------------- Private methods --------------------

  // Releases the connection from memory
  // (should be called from 'onClose' event on socket).
  private release()
  {
    /// Disabled for now.
    // // It's ok if player doesn't exist here, it happens
    // // when browser has opened connection but player hasn't
    // // logged in yet or when player reconnects from different
    // // location and the old connection is closed.
    // if (this.isLoggedIn())
    // {
    //   this.player.logout();
    //   this.player = null;
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
      logNormalDisconnect(this.getPlayerInfo(), event);
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