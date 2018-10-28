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
import { SceneUpdate } from "../../Shared/Protocol/SceneUpdate";
import { ShipToScene } from "../../Shared/Protocol/ShipToScene";
import { KeyboardInput } from "../../Server/Protocol/KeyboardInput";
import { MouseInput } from "../../Server/Protocol/MouseInput";
import { SetDestination } from "../../Server/Protocol/SetDestination";

// 3rd party modules.
// Use 'isomorphic-ws' to use the same code on both client and server.
import * as WebSocket from "isomorphic-ws";
import { Game } from "../Game/Game";

// We need to registr packet classes here because when a module is
// imported and not used, typescript doesn't execute it's code.
Classes.registerSerializableClass(SystemMessage);
Classes.registerSerializableClass(SceneUpdate);
Classes.registerSerializableClass(ShipToScene);
Classes.registerSerializableClass(KeyboardInput);
Classes.registerSerializableClass(MouseInput);
Classes.registerSerializableClass(SetDestination);

export class Connection extends Socket
{
  constructor(webSocket: WebSocket, ip: string, url: string)
  {
    super(webSocket, ip, url);
  }

  // ---------------- Public methods --------------------

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

  /// TODO: Výhledově tohle nejspíš bude jinde
  ///  (asi v procesení EnterGameRequestu).
  public sendShipToScene()
  {
    const shipInfo = Game.getShipToSceneInfo();

    const packet = new ShipToScene
    (
      shipInfo.geometry,
      shipInfo.position,
      shipInfo.angle
    );

    this.send(packet);
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