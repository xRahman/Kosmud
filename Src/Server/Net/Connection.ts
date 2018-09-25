/*
  Part of BrutusNEXT

  A connection to the server.
*/

'use strict';

import {ERROR} from '../../Shared/ERROR';
import {REPORT} from '../../Shared/REPORT';
import {Connection as SharedConnection} from '../../Shared/Net/Connection';
import {Syslog} from '../../Shared/Syslog';
import {Serializable} from '../../Shared/Class/Serializable';
import {Message} from '../../Server/Net/Message';
import {MessageType} from '../../Shared/MessageType';
import {ServerSocket} from '../../Server/Net/ServerSocket';
// import {Account} from '../../../server/lib/account/Account';
// import {GameEntity} from '../../../server/game/GameEntity';
import {Classes} from '../../Shared/Class/Classes';
import {Connections} from '../../Server/Net/Connections';
import {IncomingPacket} from '../../Shared/Protocol/IncomingPacket';
import {OutgoingPacket} from '../../Shared/Protocol/OutgoingPacket';
import {SystemMessage} from '../../Server/Protocol/SystemMessage';
import {SystemMessageData} from '../../Shared/Protocol/SystemMessageData';
import {SceneUpdate} from '../../Server/Protocol/SceneUpdate';
import {SceneUpdateData} from '../../Shared/Protocol/SceneUpdateData';
import {PlayerInput} from '../../Server/Protocol/PlayerInput';
import {PlayerInputData} from '../../Shared/Protocol/PlayerInputData';
// import {MudMessage} from '../../../server/lib/protocol/MudMessage';
SystemMessage;
SystemMessageData;
SceneUpdate;
SceneUpdateData;
PlayerInput;
PlayerInputData;

// 3rd party modules.
import * as WebSocket from 'ws';

/// TODO: Tohohle se zbavit
/// - Tak v Connection bych tohle opravdu nehledal...
/// (Navíc to očividně typescript nekontroluje...)
// Force module import (so that the module code is assuredly executed
// instead of typescript just registering a type). This ensures that
// class constructor is added to Classes so it can be deserialized.
// import '../../../server/lib/protocol/Command';
// import '../../../server/lib/protocol/SystemMessage';
// import '../../../server/lib/protocol/LoginRequest';
// import '../../../server/lib/protocol/RegisterRequest';
// import '../../../server/lib/protocol/ChargenRequest';
// import '../../../server/lib/protocol/EnterGameRequest';
SystemMessage;

export class Connection implements SharedConnection
{
  constructor(webSocket: WebSocket, ip: string, url: string)
  {
    this.socket = new ServerSocket(this, webSocket, ip, url);
  }

  // ----------------- Public data ----------------------

  /// Disabled for now.
  // public ingameEntity: (GameEntity | null) = null;

  // ---------------- Protected data --------------------

  protected socket: ServerSocket; /// (ServerSocket | null) = null;

  // ----------------- Private data ---------------------

  /// Disabled for now.
  // private account: (Account | null) = null;

  // --------------- Public accessors -------------------

  /// Disabled for now.
  // public setAccount(account: Account | null)
  // {
  //   this.account = account;
  // }

  /// Disabled for now.
  // ! Throws an exception on error.
  // public getAccount(): Account
  // {
  //   if (!this.account || !this.account.isValid())
  //     throw new Error("Attempt to access invalid account on connection");

  //   return this.account;
  // }

  public getIpAddress() { return this.socket.getIpAddress(); }

  // Connection origin description in format "(url [ip])".
  public getOrigin() { return this.socket.getOrigin() }

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

  // ---------------- Public methods --------------------

  // Closes the connection and removes it from memory
  // (this is not possible if it is still linked to an
  //  account).
  public close()
  {
    /// Disabled for now.
    // if (this.account !== null)
    // {
    //   ERROR("Attempt to close connection that is still linked"
    //     + " to account (" + this.account.getErrorIdString() + ")."
    //     + " Connection is not closed");
    //   return;
    // }

    if (!this.socket)
    {
      ERROR("Unable to close connection because it has no socket"
        + " attached. Removing it from Connections");
      Connections.release(this);
      return;
    }

    if (!this.socket.close())
    {
      // If socket can't be closed (websocket is missing
      // or it's already CLOSED), release the connection
      // from memory. If it can be closed, 'onClose' event
      // will be triggered and it's handler will release
      // the connection.
      Connections.release(this);
    }
  }

  /// Disabled for now.
  // public attachToGameEntity(gameEntity: GameEntity)
  // {
  //   this.ingameEntity = gameEntity;
  //   gameEntity.connection = this;
  // }

  /// Disabled for now.
  // public detachFromGameEntity()
  // {
  //   if (this.account === null)
  //   {
  //     ERROR("Unexpected 'null' value");
  //     return;
  //   }

  //   if (this.ingameEntity === null)
  //   {
  //     ERROR("Attempt to detach ingame entity"
  //       + " from " + this.account.getName() + "'s"
  //       + " player connection when there is"
  //       + " no ingame entity attached to it");
  //   }

  //   if (this.ingameEntity === null)
  //   {
  //     ERROR("Unexpected 'null' value");
  //     return;
  //   }

  //   this.ingameEntity.detachConnection();
  // }

  /// Disabled for now.
  // public sendMudMessage(message: Message)
  // {
  //   if (message === null || message === undefined)
  //   {
  //     ERROR("Invalid message");
  //     return;
  //   }

  //   let packet = new MudMessage();

  //   let composedMessage = message.compose()

  //   if (composedMessage === null)
  //     return;

  //   packet.message = composedMessage;

  //   this.send(packet);
  // }

  // Processes data received from the client.
  public async receiveData(data: string)
  {
    let deserializedPacket = Serializable.deserialize(data);
    
    if (!deserializedPacket)
      return;

    let packet = deserializedPacket.dynamicCast(IncomingPacket);

    if (packet === null)
      return;

    await packet.process(this);
  }

  // Sends 'packet' to web socket.
  public send(packet: OutgoingPacket)
  {
    /// TODO: packet.serialize() sice zatím nevyhazuje výjimky,
    /// ale časem bude.
    try
    {
      this.socket.send
      (
        packet.serialize(Serializable.Mode.SEND_TO_CLIENT)
      );
    }
    catch (error)
    {
      REPORT(error, "Packet is not sent");
    }
  }

  public announceReconnect()
  {
    let message = new Message
    (
      "Someone (hopefully you) has just logged into this account"
        + " from different location. Closing this connection.",
      MessageType.CONNECTION_INFO
    );

    /// Disabled for now.
    // this.sendMudMessage(message);
  }

  // --------------- Private methods --------------------

  // ---------------- Event handlers --------------------

  // Releases the connection from memory
  // (should be called from 'onClose' event on socket).
  public release()
  {
    /// Disabled for now.
    // // It's ok if account doesn't exist here, it happens
    // // when brower has opened connection but player hasn't
    // // logged in yet or when player reconnects from different
    // // location and the old connection is closed.
    // if (this.account)
    // {
    //   this.account.logout();
    //   this.account = null;
    // }

    // Release this connection from memory.
    Connections.release(this);
  }
}
