/*
  Part of BrutusNEXT

  Connection to the server.
*/

'use strict';

import {ERROR} from '../../Shared/ERROR';
import {Connection as SharedConnection} from '../../Shared/Net/Connection';
import {Serializable} from '../../Shared/Class/Serializable';
import {Client} from '../../Client/Application/Client';
import {ClientSocket} from '../../Client/Net/ClientSocket';
// import {Entity} from '../../../shared/lib/entity/Entity';
// import {ClientEntities} from '../../../client/lib/entity/ClientEntities';
// import {Windows} from '../../../client/gui/window/Windows';
// import {ScrollWindow} from '../../../client/gui/scroll/ScrollWindow';
// import {Avatar} from '../../../client/lib/connection/Avatar';
import {IncomingPacket} from '../../Shared/Protocol/IncomingPacket';
import {OutgoingPacket} from '../../Shared/Protocol/OutgoingPacket';
// import {Command} from '../../../client/lib/protocol/Command';
import {SystemMessage} from '../../Client/Protocol/SystemMessage';
import {SystemMessageData} from '../../Shared/Protocol/SystemMessageData';
import {SceneUpdate} from '../../Client/Protocol/SceneUpdate';
import {SceneUpdateData} from '../../Shared/Protocol/SceneUpdateData';
import {PlayerInput} from '../../Client/Protocol/PlayerInput';
import {PlayerInputData} from '../../Shared/Protocol/PlayerInputData';
// import {Account} from '../../../client/lib/account/Account';
// import {Character} from '../../../client/game/character/Character';

/// TODO: Tohohle se zbavit.
// Force module import (so that the module code is assuredly executed
// instead of typescript just registering a type). This ensures that
// class constructor is added to Classes so it can be deserialized.
// import '../../../shared/lib/protocol/Move';
// import '../../../client/game/world/Room';
// import '../../../client/lib/protocol/LoginResponse';
// import '../../../client/lib/protocol/RegisterResponse';
// import '../../../client/lib/protocol/ChargenResponse';
// import '../../../client/lib/protocol/EnterGameResponse';
SystemMessage;
SystemMessageData;
SceneUpdate;
SceneUpdateData;
PlayerInput;
PlayerInputData;

export class Connection implements SharedConnection
{
  private socket: (ClientSocket | null) = null;

  // -------------- Static class data -------------------

  // ----------------- Public data ----------------------

  /// Disabled for now.
  // public activeAvatar: (Avatar | null) = null;

  // ----------------- Private data ---------------------

  /// Disabled for now.
  // private account: (Account | null) = null;

  /// Disabled for now.
  // private avatars = new Set<Avatar>();

  // --------------- Static accessors -------------------

  /// Disabled for now.
  // public static get account()
  // {
  //   let connection = Client.connection;

  //   if (!connection)
  //   {
  //     ERROR("Missing or invalid connection");
  //     return;
  //   }

  //   return connection.account;
  // }

  // ---------------- Static methods --------------------

  public static send(packet: OutgoingPacket)
  {
    let connection = Client.connection;

    if (!connection)
    {
      ERROR("Missing or invalid connection. Packet is not sent");
      return;
    }

    connection.send(packet);
  }

  /// Disabled for now.
  // public setAccount(account: Account)
  // {
  //   if (!account || !account.isValid())
  //   {
  //     ERROR("Attempt to set invalid account to the connection."
  //       + " Account is not set.");
  //     return;
  //   }

  //   if (this.account !== null)
  //   {
  //     ERROR("Attempt to set account " + account.getErrorIdString()
  //       + " to the connection when there already is an account set."
  //       + " Account can only be set to the connection once");
  //   }

  //   this.account = account;
  // }

  /// Disabled for now.
  // public getAccount() {  return this.account; }

  // ---------------- Public methods --------------------

  /// TODO: Na serveru je prakticky stejná fce, asi by to chtělo sloučit
  /// do společného předka v /shared
  public async receiveData(data: string)
  {
    /// TODO: deserialize() by mělo házet exception místo return null,
    /// takže pak půjde zavolat:
    ///   let packet = Serializable.deserialize(data).dynamicCast(Packet);
    let deserializedPacket = Serializable.deserialize(data);
    
    if (!deserializedPacket)
      return;
    
    let packet = deserializedPacket.dynamicCast(IncomingPacket);

    if (packet !== null)
      await packet.process(this);
  }

  /// Disabled for now.
  // public createAvatar(character: Character): Avatar
  // {
  //   let avatar = new Avatar(character);

  //   this.avatars.add(avatar);

  //   // Newly created avatar is automaticaly set as active
  //   // (this should only happen when player logs in with
  //   //  a new character).
  //   this.activeAvatar = avatar;

  //   return avatar;
  // }

  // Attempts to open the websocket connection.
  public connect()
  {
    if (this.socket !== null)
      ERROR("Socket already exists");

    this.socket = new ClientSocket(this);
    this.clientMessage('Opening websocket connection...');
    this.socket.connect();
  }

  /// Disabled for now.
  // // Sends 'command' to the connection.
  // public sendCommand(command: string)
  // {
  //   let packet = new Command();

  //   packet.command = command;

  //   if (!this.socket)
  //   {
  //     ERROR("Unexpected 'null' value");
  //     return
  //   }

  //   // If the connection is closed, any user command
  //   // (even an empty one) triggers reconnect attempt.
  //   if (!this.socket.isOpen())
  //     this.socket.reConnect();
  //   else
  //     this.send(packet);
  // }

  // Sends system message to the connection.
  public sendSystemMessage(type: SystemMessageData.Type, message: string)
  {
    let packet = new SystemMessage
    (
      new SystemMessageData(type, message)
    );

    this.send(packet);
  }

  /// Disabled for now.
  // // Receives 'message' from the connection
  // // (appends it to the output of respective scrollwindow).
  // public receiveMudMessage(message: string)
  // {
  //   if (this.activeAvatar)
  //     this.activeAvatar.receiveMessage(message);
  // }

  // Outputs a client system message.
  public clientMessage(message: string)
  {
    /// Disabled for now.
    // if (this.activeAvatar)
    //   this.activeAvatar.clientMessage(message);
  }

  public reportClosingBrowserTab()
  {
    this.sendSystemMessage("Client closed browser tab", "");
  }

  public close(reason: (string | null) = null)
  {
    if (this.socket)
      this.socket.close(reason);
  }

  // ---------------- Event handlers --------------------

  // ---------------- Private methods -------------------

  private send(packet: OutgoingPacket)
  {
    if (!this.socket)
    {
      ERROR("Unexpected 'null' value");
      return
    }
    
    if (!this.socket.isOpen())
    {
      ERROR("Attempt to send packet to the closed connection");
      return;
    }

    this.socket.send
    (
      packet.serialize(Serializable.Mode.SEND_TO_SERVER)
    );
  }
}