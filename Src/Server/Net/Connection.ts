/*
  Part of Kosmud

  A connection to the server.
*/

import {Syslog} from '../../Shared/Log/Syslog';
import {WebSocketEvent} from '../../Shared/Net/WebSocketEvent';
import {Message} from '../../Server/Net/Message';
import {MessageType} from '../../Shared/MessageType';
import {Types} from '../../Shared/Utils/Types';
import {Packet} from '../../Shared/Protocol/Packet';
import {Socket} from '../../Server/Net/Socket';
import {Classes} from '../../Shared/Class/Classes';
import {Connections} from '../../Server/Net/Connections';
import {SystemMessage} from '../../Server/Protocol/SystemMessage';
import {SceneUpdate} from '../../Shared/Protocol/SceneUpdate';
import {PlayerInput} from '../../Server/Protocol/PlayerInput';

// 3rd party modules.
// Use 'isomorphic-ws' to use the same code on both client and server.
import * as WebSocket from 'isomorphic-ws';

// We need to registr packet classes here because when a module is
// imported and not used, typescript doesn't execute it's code.
Classes.registerSerializableClass(SystemMessage);
Classes.registerSerializableClass(SceneUpdate);
Classes.registerSerializableClass(PlayerInput);


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
    // if (this.account)
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
      packet.serialize('Send to Client')
    );
  }

  /// Disabled for now.
  // public announceReconnect()
  // {
  //   let message = new Message
  //   (
  //     "Someone (hopefully you) has just logged into this account"
  //       + " from different location. Closing this connection.",
  //     MessageType.CONNECTION_INFO
  //   );
  // }

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
    // if (this.account)
    // {
    //   this.account.logout();
    //   this.account = null;
    // }

    // Release this connection from memory.
    Connections.remove(this);
  }

  // ---------------- Event handlers --------------------

  // ~ Overrides Shared.Socket.onClose().
  protected onClose(event: Types.CloseEvent)
  {
    super.onClose(event);

    // 'event.reason' is checked because for some reason Chrome sometimes
    // closes webSocket with code 1006 when the tab is closed even though
    // we close() the socket manually in onBeforeUnload() handler (see
    // ClientApp.onBeforeUnload() for more details).
    const tabHasBeenClosed = (event.reason === WebSocketEvent.TAB_CLOSED);
    const isNormalClose = WebSocketEvent.isNormalClose(event.code);
    const normalDisconnect = isNormalClose || tabHasBeenClosed;
    
    if (!normalDisconnect)
    {
      this.logSocketClosingError(event);
      return;
    }

    logNormalDisconnect(this.getUserInfo(), tabHasBeenClosed);

    this.release();
  }
}

// ----------------- Auxiliary Functions ---------------------

function logNormalDisconnect(user: string, tabHasBeenClosed: boolean)
{
  if (tabHasBeenClosed)
  {
    Syslog.log
    (
      "User " + user + " has disconnected by closing or reloading browser tab",
      MessageType.CONNECTION_INFO
    );
  }
  else
  {
    Syslog.log
    (
      "User " + user + " has disconnected",
      MessageType.CONNECTION_INFO
    );
  }
}