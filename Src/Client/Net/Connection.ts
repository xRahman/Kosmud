/*
  Part of BrutusNEXT

  Connection to the server.
*/

'use strict';

import {ERROR} from '../../Shared/Log/ERROR';
import {Classes} from '../../Shared/Class/Classes';
// import {Connection as SharedConnection} from '../../Shared/Net/Connection';
import * as Shared from '../../Shared/Net/Connection';
import {Serializable} from '../../Shared/Class/Serializable';
import {Client} from '../../Client/Application/Client';
// import {Entity} from '../../../shared/lib/entity/Entity';
// import {ClientEntities} from '../../../client/lib/entity/ClientEntities';
// import {Windows} from '../../../client/gui/window/Windows';
// import {ScrollWindow} from '../../../client/gui/scroll/ScrollWindow';
// import {Avatar} from '../../../client/lib/connection/Avatar';
// import {Command} from '../../../client/lib/protocol/Command';
// import {Account} from '../../../client/lib/account/Account';
// import {Character} from '../../../client/game/character/Character';
import {MessageType} from '../../Shared/MessageType';
import {WebSocketEvent} from '../../Shared/Net/WebSocketEvent';
import {Types} from '../../Shared/Utils/Types';
import {Packet} from '../../Shared/Protocol/Packet';
import {SystemMessage} from '../../Shared/Protocol/SystemMessage';
import {SceneUpdate} from '../../Client/Protocol/SceneUpdate';
import {PlayerInput} from '../../Shared/Protocol/PlayerInput';
import {Socket} from '../../Client/Net/Socket';

Classes.registerSerializableClass(SystemMessage);
Classes.registerSerializableClass(SceneUpdate);
Classes.registerSerializableClass(PlayerInput);

export class Connection extends Socket
{
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

  public static checkWebSocketSupport(): boolean
  {
    if (typeof WebSocket === 'undefined')
    {
      let MozWebSocket = (window as any)['MozWebSocket'];

      // Use 'MozWebSocket' if it's available.
      if (MozWebSocket)
      {
        WebSocket = MozWebSocket;
        return true;
      }

      alert("Sorry, you browser doesn't support websockets.");
      return false;
    }

    return true;
  }

  public static connect()
  {
    // There is no point in error handling here, because opening
    // a socket is asynchronnous. If an error occurs, 'error' event
    // is fired and onSocketError() is executed.
    //   We don't need to specify port because websocket server runs
    // inside https server so it automaticaly uses htts port.
    let webSocket = new WebSocket('wss://' + window.location.hostname);

    /// TODO:
    /// - vyrobit Connection
    ///   - passnout jí 'webSocket' jako parametr (ta by ho měla passnout
    ///      socketu).
  }
  // // Attempts to open the websocket connection.
  // public connect()
  // {
  //   if (this.socket !== null)
  //     ERROR("Socket already exists");

  //   this.socket = new ClientSocket(this);
  //   this.clientMessage('Opening websocket connection...');
  //   this.socket.connect();
  // }

  /// TODO: Tohle by asi mělo bejt static a trochu jinak.
  // // Attempts to reconnect.
  // public reConnect()
  // {
  //   ///console.log('reConnect(). Status: ' + this.socket.readyState);

  //   if (this.isOpen())
  //     // There is no point in reconnecting an open socket.
  //     /// TODO: Tohle by asi měl bejt error (exception).
  //     return;

  //   if (this.isConnecting())
  //   /// TODO: Tohle by asi měl bejt error (exception).
  //     // There is no point if the socket is already trying to connect.
  //     return;
    
  //   if (this.isClosing())
  //     // If the socket is still closing, old event handlers are not yet
  //     // detached so we shouldn't create a new socket yet.
  //     /// TODO: Asi by to chtelo dát message playerovi a ideálně
  //     /// pustit auto-reconnect, pokud ještě neběží.
  //     return;

  //   this.clientMessage
  //   (
  //     'Attempting to reconnect...'
  //   );

  //   /// TODO: Hmm, tohle teď dělá Connection.connect().
  //   /// Možná by se reconnect taky měl řešit taky tam.
  //   this.connect();
  // }


  // ! Throws exception on error.
  // Note:
  //   Make sure that you check isOpen() before you call send().
  //   (You will get an exception if you try to send data to closed
  //    connection but it's better to handle it beforehand.)
  public static send(packet: Packet)
  {
    let connection = Client.connection;

    if (!connection)
    {
      throw new Error("Missing or invalid connection. Packet is not sent");
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
    /// TODO: Není to error?
    if (this.isOpen())
    {
      let packet = new SystemMessage(message, messageType);

      this.send(packet);
    }
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

  // ---------------- Event handlers --------------------

  // ~ Overrides Socket.onClose().
  protected onClose(event: Types.CloseEvent)
  {
    super.onClose(event);

    if (!WebSocketEvent.isNormalClose(event.code))
    {
      this.logSocketClosingError(event);

      if (!this.wasConnected)
      {
        this.reportConnectionFailure();
      }
      else
      {
        this.reportAbnormalDisconnect();
      }
      
      return;
    }

    this.reportNormalDisconnect();

    /// TODO: Auto reconnect:
    /// (Vyhledove by to taky chtelo timer, aby to zkousel opakovane).
  }

  // ---------------- Private methods -------------------

  // ! Throws exception on error.
  private send(packet: Packet)
  {
    /// TODO: Měl by se tady chytat error?
    this.sendData
    (
      // ! Throws exception on error.
      packet.serialize('Send to Server')
    );
  }

  private reportConnectionFailure()
  {
    // Test is user device is online.
    if (navigator.onLine)
    {
      this.clientMessage
      (
        'Failed to open websocket connection.'
        + ' Server is down or unreachable.'
      );
    }
    else
    {
      this.clientMessage
      (
        'Failed to open websocket connection. Your device reports'
        + ' offline status. Please check your internet connection.'
      );
    }
  }

  private reportNormalDisconnect()
  {
    this.clientMessage
    (
      'Connection closed.'
    );
  }

  private reportAbnormalDisconnect()
  {
    // Test if device is online.
    if (isDeviceOnline())
    {
      this.clientMessage
      (
        'You have been disconnected from the server.'
      );
    }
    else
    {
      this.clientMessage
      (
        'You have been disconnected. Your device reports'
        + ' offline status, please check your internet connection.'
      );
    }
  }
}

// ----------------- Auxiliary Functions ---------------------

function isDeviceOnline()
{
  return navigator.onLine;
}