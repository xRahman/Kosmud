/*
  Part of BrutusNEXT

  Connection to the server.
*/

'use strict';

import {ERROR} from '../../Shared/ERROR';
import {Classes} from '../../Shared/Class/Classes';
// import {Connection as SharedConnection} from '../../Shared/Net/Connection';
import * as Shared from '../../Shared/Net/Connection';
import {Serializable} from '../../Shared/Class/Serializable';
import {Client} from '../../Client/Application/Client';
import {ClientSocket} from '../../Client/Net/ClientSocket';
// import {Entity} from '../../../shared/lib/entity/Entity';
// import {ClientEntities} from '../../../client/lib/entity/ClientEntities';
// import {Windows} from '../../../client/gui/window/Windows';
// import {ScrollWindow} from '../../../client/gui/scroll/ScrollWindow';
// import {Avatar} from '../../../client/lib/connection/Avatar';
// import {Command} from '../../../client/lib/protocol/Command';
// import {Account} from '../../../client/lib/account/Account';
// import {Character} from '../../../client/game/character/Character';
import {MessageType} from '../../Shared/MessageType';
import {Packet} from '../../Shared/Protocol/Packet';
import {SystemMessage} from '../../Shared/Protocol/SystemMessage';
import {SceneUpdate} from '../../Client/Protocol/SceneUpdate';
import {PlayerInput} from '../../Shared/Protocol/PlayerInput';

Classes.registerSerializableClass(SystemMessage);
Classes.registerSerializableClass(SceneUpdate);
Classes.registerSerializableClass(PlayerInput);

export class Connection implements Shared.Connection
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

  public static send(packet: Packet)
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


  /// TODO: Tohle by se asi hodilo, ale:
  /// - je to stejný kód jako na Serveru, sloučit.
  // // ! Throws exception on error.
  // public getIpAddress()
  // {
  //   if (!this.socket)
  //     throw new Error("Socket does not exist");
  //
  //   return this.socket.getIpAddress();
  // }
  //
  // // Connection origin description in format "(url [ip])".
  // // ! Throws exception on error.
  // public getOrigin()
  // {
  //   if (!this.socket)
  //     throw new Error("Socket does not exist");
  //
  //   return this.socket.getOrigin();
  // }
  //
  // // ! Throws exception on error.
  // public getUserInfo()
  // {
  //   let info = "";
  //
  //   /// Disabled for now.
  //   // if (this.account)
  //   //   info += this.account.getEmail() + " ";
  //
  //   // Add (url [ip]).
  //   info += this.getOrigin();
  //
  //   return info;
  // }

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
    
    let packet = deserializedPacket.dynamicCast(Packet);

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
  public sendSystemMessage(message: string, messageType: MessageType)
  {
    let packet = new SystemMessage(message, messageType);

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
    /// TODO: Posílat userInfo, až ho budu uměr vyrobit.

    // this.sendSystemMessage
    // (
    //   this.getUserInfo() + " has disconnected by"
    //     + " closing or reloading browser tab",
    //   MessageType.CONNECTION_INFO
    // );

    this.sendSystemMessage
    (
      " User has disconnected by"
        + " closing or reloading browser tab",
      MessageType.CONNECTION_INFO
    );
  }

  public close(reason: (string | null) = null)
  {
    if (this.socket)
      this.socket.close(reason);
  }

  // ---------------- Event handlers --------------------

  // ---------------- Private methods -------------------

  private send(packet: Packet)
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