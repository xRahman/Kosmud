/*
  Part of BrutusNEXT

  Encapsulates a websocket.
*/

'use strict';

import {ERROR} from '../../Shared/ERROR';
import {Utils} from '../../Shared/Utils';
import {Syslog} from '../../Shared/Syslog';
import {WebSocketEvent} from '../../Shared/Net/WebSocketEvent';
import {Packet} from '../../Shared/Protocol/Packet';
import {Connection} from '../../Server/Net/Connection';
import {MessageType} from '../../Shared/MessageType';
// import {AdminLevel} from '../../../shared/lib/admin/AdminLevel';

import * as WebSocket from 'ws';

// Built-in node.js modules.
// import * as net from 'net';  // Import namespace 'net' from node.js
// import * as events from 'events';  // Import namespace 'events' from node.js

export class ServerSocket
{
  constructor
  (
    public connection: Connection,
    private webSocket: WebSocket,
    // Remote ip address.
    private ip: string,
    // Remote url.
    private url: string
  )
  {
    this.init();
  }

  // -------------- Static class data -------------------

  // ----------------- Private data ---------------------

  // ----------------- Public data ----------------------

  ///public connection: (Connection | null) = null;

  // --------------- Public accessors -------------------

  public getOrigin()
  {
    return "(" + this.url + " [" + this.ip + "])";
  }

  public getIpAddress(): string
  {
    return this.ip;
  }

  // ---------------- Public methods --------------------

  // Sends packet to the client.
  public send(data: string)
  {
    try
    {
      this.webSocket.send(data);
    }
    catch (error)
    {
      Syslog.log
      (
        "Client ERROR: Failed to send packet to websocket"
          + " " + this.getOrigin() + ". Reason: " + error.message,
        MessageType.WEBSOCKET_SERVER
      );
    }
  }

  // Closes the socket, ending the connection.
  // -> Returns 'false' if connection couldn't be closed.
  public close()
  {
    if (!this.webSocket)
      return false;
      
    // If the socket is already closed, close() would do nothing.
    if (this.webSocket.readyState === 3)  // '3' means CLOSED.
      return false;

    this.webSocket.close();

    return true;
  }

  // -------------- Protected methods -------------------

  // --------------- Private methods --------------------

  // Registers event handlers, etc.
  private init()
  {
    if (this.webSocket === null || this.webSocket === undefined)
    {
      ERROR('Attempt to init invalid socket');
      return;
    }

    this.webSocket.onmessage = (event) => { this.onReceiveMessage(event); };
    this.webSocket.onopen = (event) => { this.onOpen(event); };
    this.webSocket.onerror = (event) => { this.onError(event); };
    this.webSocket.onclose = (event) => { this.onClose(event); };
  }

  private reportSocketClosingError
  (
    event:
    {
      wasClean: boolean, code: number, reason: string, target: WebSocket
    }
  )
  {
    let message = "Socket " + this.getOrigin() + " closed"
        + " because of error.";

    if (event.reason)
      message += " Reason: " + event.reason;

    message += " Code: " + event.code + ". Description:"
    message += " " + WebSocketEvent.description(event.code);

    Syslog.log
    (
      message,
      MessageType.WEBSOCKET_SERVER
    );
  }

  private reportSocketClosing
  (
    event:
    {
      wasClean: boolean, code: number, reason: string, target: WebSocket
    }
  )
  {
    // Error code 1000 means that the connection was closed normally.
    // 'event.reason' is checked because for some reason Chrome sometimes
    // closes webSocket with code 1006 when the tab is closed even though
    // we close() the socket manually in onBeforeUnload() handler (see
    // ClientApp.onBeforeUnload() for more details).
    if (event.code === 1000 || event.reason === WebSocketEvent.TAB_CLOSED)
    {
      Syslog.log
      (
        "Connection " + this.getOrigin() + " has been closed",
        MessageType.WEBSOCKET_SERVER
      );
      return;
    }

    this.reportSocketClosingError(event);
  }


  // ---------------- Event handlers --------------------

  private async onReceiveMessage
  (
    event: { data: WebSocket.Data, type: string, target: WebSocket }
  )
  {
    // if (flags.binary === true)
    // {
    //   // Data is supposed to be sent in text mode.
    //   // (This is a client error, we can't really do
    //   //  anything about it - so we just log it.)
    //   Syslog.log
    //   (
    //     "Client ERROR: Received binary data from connection"
    //       + " " + this.getOrigin() + ". Data is not processed",
    //     MessageType.WEBSOCKET_SERVER,
    //     AdminLevel.IMMORTAL
    //   );
    //   return;
    // }

    if (typeof event.data !== 'string')
    {
      ERROR("Websocket " + this.getOrigin() + " received"
        + " non-string data. Message will not be processed"
        + " because we can only process string data");
      return;
    }

    /// DEBUG:
    console.log('(ws) received message: ' + event.data);

    try
    {
      await this.connection.receiveData(event.data);
    }
    catch (error)
    {
      Syslog.reportUncaughtException(error);
    }
  }

  private onOpen(event: { target: WebSocket })
  {
    // No action.
  }

  private onError
  (
    event: { error: any, message: string, type: string, target: WebSocket }
  )
  {
    Syslog.log
    (
      "Websocket ERROR: Error occured on websocket " + this.getOrigin()
        + " :" + event.message,
      MessageType.WEBSOCKET_SERVER
    );
  }

  private onClose
  (
    event:
    {
      wasClean: boolean, code: number, reason: string, target: WebSocket
    }
  )
  {
    this.reportSocketClosing(event);

    if (!this.connection)
    {
      ERROR("Missing connection reference on websocket."
        + " Account and connection won't be released"
        + " from memory");
      return;
    }

    this.connection.release();
  }
}