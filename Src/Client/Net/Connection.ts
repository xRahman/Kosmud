/*
  Part of Kosmud

  Connection to the server.
*/


import {ERROR} from '../../Shared/Log/ERROR';
import {Classes} from '../../Shared/Class/Classes';
// import {Connection as SharedConnection} from '../../Shared/Net/Connection';
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

// 3rd party modules.
// Use 'isomorphic-ws' to be able to use the same code
// on both client and server.
import * as WebSocket from 'isomorphic-ws';

Classes.registerSerializableClass(SystemMessage);
Classes.registerSerializableClass(SceneUpdate);
Classes.registerSerializableClass(PlayerInput);

export class Connection extends Socket
{
  // ----------------- Private data ---------------------

  private static connection: Connection | "Not connected" = "Not connected";

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

  public static registerBeforeUnloadEvent()
  {
    window.onbeforeunload =
      (event: BeforeUnloadEvent) => { this.onBeforeUnload(event); }
  }

  public static connect()
  {
    if (this.connection !== "Not connected")
    {
      /// TODO: To nemusí bejt pravda, connection nemusí bejt open.
      ERROR("Already connected");
    }

    // There is no point in error handling here, because opening
    // a socket is asynchronnous. If an error occurs, 'error' event
    // is fired and onSocketError() is executed.
    //   We don't need to specify port because websocket server runs
    // inside https server so it automaticaly uses htts port.
    let webSocket = new WebSocket('wss://' + window.location.hostname);

    this.connection = new Connection(webSocket);
  }

  public static isOpen()
  {
    if (this.connection ===  "Not connected")
      return false;

    return this.connection.isOpen();
  }

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
  // Make sure that you check isOpen() before you call send().
  // (You will get an exception if you try to send data to closed
  //  connection but it's better to handle it beforehand.)
  public static send(packet: Packet)
  {
    if (this.connection === "Not connected")
    {
      throw new Error("Connection doesn't exist yet. Packet is not sent");
    }

    this.connection.send(packet);
  }

  // ---------------- Public methods --------------------

  // Sends system message to the connection.
  public sendSystemMessage(message: string, messageType: MessageType)
  {
    if (this.isOpen())
    {
      let packet = new SystemMessage(message, messageType);

      this.send(packet);
    }
  }

  public reportClosingBrowserTab()
  {
    /// Idea původně byla, že log message vyrobím rovnou na clientu
    /// a pošlu ho na server. Klient ale neví, jaký má ipčko a url,
    /// takže možná bude přece jen lepší ten log message konstruovat
    /// až na serveru.
    ///   Co by se mělo posílat?
    ///   - možná spíš nějakej SystemEvent místo SystemMessage?

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

  /// Tohle by mělo bejt někde jinde (v Document asi?)
  private static onBeforeUnload(event: BeforeUnloadEvent)
  {
    if (this.connection !== "Not connected")
    {
      this.connection.reportClosingBrowserTab();

      // Close the connection to prevent browser from closing it
      // abnormally with event code 1006.
      //   For some strange reson this doesn't alway work in Chrome.
      // If we call socket.close(1000, "Tab closed"), onClose() event
      // handler on respective server socket will receive the reason
      // but sometimes code will be 1006 instead of 1000. To circumvent
      // this, we send WebSocketEvent.REASON_CLOSE when socket is closed
      // from onBeforeUnload() and we check for it in ServerSocket.onClose().
      this.connection.close(WebSocketEvent.TAB_CLOSED);
    }
  }

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
    }
    else
    {
      this.reportNormalDisconnect();
    }

    /// TODO: Auto reconnect.
  }

  // --------------- Protected methods ------------------

  // ! Throws exception on error.
  protected send(packet: Packet)
  {
    this.sendData
    (
      // ! Throws exception on error.
      packet.serialize('Send to Server')
    );
  }

  // ---------------- Private methods -------------------

  private reportConnectionFailure()
  {
    // Test is user device is online.
    if (navigator.onLine)
    {
      alert
      (
        'Failed to open websocket connection.'
        + ' Server is down or unreachable.'
      );
    }
    else
    {
      alert
      (
        'Failed to open websocket connection. Your device reports'
        + ' offline status. Please check your internet connection.'
      );
    }
  }

  private reportNormalDisconnect()
  {
    alert
    (
      'Server has closed the connection.'
    );
  }

  private reportAbnormalDisconnect()
  {
    // Test if device is online.
    if (isDeviceOnline())
    {
      alert
      (
        'You have been disconnected from the server.'
      );
    }
    else
    {
      alert
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