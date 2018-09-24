/*
  Part of BrutusNEXT

  Implements websocket server.
*/

/*
  Implementation note:
    Event handlers are registered using lambda expression '() => {}'.
    For example:

      this.webSocketServer.on
      (
        'error',
        (error) => { this.onServerError(error); }
      );

    The reason is that it is not guaranteed in TypeScript that methods
    will get called on an instance of their class. In other words 'this'
    will be something else than you expect when you register an event
    handler.
      Lambda expression solves this by capturing 'this', so you may use it
    correcly within lambda function body.
*/

'use strict';

import {ERROR} from '../../Shared/ERROR';
import {FATAL_ERROR} from '../../Shared/FATAL_ERROR';
import {Syslog} from '../../Shared/Syslog';
import {MessageType} from '../../Shared/MessageType';
import {Server} from '../../Server/Application/Server';
import {Connection} from '../../Server/Net/Connection';
import {Connections} from '../../Server/Net/Connections';
import {HttpServer} from '../../Server/Net/HttpServer';
import {ServerSocket} from '../../Server/Net/ServerSocket';

// 3rd party modules.
import * as WebSocket from 'ws';

// Built-in node.js modules.
import * as net from 'net';  // Import namespace 'net' from node.js.
import * as events from 'events';  // Import namespace 'events' from node.js.
import * as http from 'http';  // Import namespace 'http' from node.js.
import * as https from 'https';  // Import namespace 'http' from node.js.

export class WebSocketServer
{
  // ----------------- Public data ----------------------

  // Do we accept new connections?
  private open = false;

  // ----------------- Private data ---------------------

  private webSocketServer: (WebSocket.Server | null) = null;

  // ---------------- Public methods --------------------

  public isOpen() { return this.open; }

  // Starts the websocket server inside a http server.
  public start(httpsServer: https.Server)
  {
    Syslog.log
    (
      "Starting websocket server",
      MessageType.SYSTEM_INFO
    );

    // Websocket server runs inside a http server so the same port can be used
    // (it is possible because WebSocket protocol is an extension of http).
    this.webSocketServer = new WebSocket.Server({ server: httpsServer });

    this.webSocketServer.on
    (
      'connection',
      (socket, request) => { this.onNewConnection(socket, request); }
    );

    // Unlike telnet server, websocket server is up immediately,
    // so we don't have to register handler for 'listening' event
    // (in fact, there is no such event on websocket server).
    //   But since the websocket server runs inside a http server,
    // it must be started after onStartListening() is fired on http
    // server.
    Syslog.log
    (
      "Websocket server is up and listening to new connections",
      MessageType.WEBSOCKET_SERVER
    );

    this.open = true;
  }

  // ---------------- Event handlers --------------------

  private async onNewConnection
  (
    webSocket: WebSocket,
    request: http.IncomingMessage
  )
  {
    let ip = request.connection.remoteAddress;

    if (!ip)
      ip = "Unknown ip address";

    ///let ip = ServerSocket.parseRemoteAddress(socket);

    // Request.url is only valid for request obtained from http.Server.
    if (!request.url)
    {
      ERROR("Invalid 'request.url'. This probably means that you are using"
        + " websocket server outside of http server. Connection is denied");
      this.denyConnection(webSocket, "Invalid request.url", ip);
      return;
    }

    let url = request.url;
    //let url = ServerSocket.parseRemoteUrl(socket);

    if (this.open === false)
    {
      this.denyConnection(webSocket, "Server is closed", ip, url);
      return;
    }

    this.acceptConnection(webSocket, ip, url);
  }

  // ---------------- Private methods --------------------

  private acceptConnection(webSocket: WebSocket, ip: string, url: string)
  {
    let connection = new Connection(webSocket, ip, url);

    Connections.add(connection)

    Syslog.log
    (
      "Accepting connection " + connection.getOrigin(),
      MessageType.WEBSOCKET_SERVER
    );
  }

  private denyConnection
  (
    socket: WebSocket,
    reason: string,
    ip: string,
    url?: string
  )
  {
    let address: string;
    
    if (url)
      address = "(" + url + "[" + ip + "])";
    else
      address = "[" + ip + "]";

    Syslog.log
    (
      "Denying connection " + address + ": " + reason,
      MessageType.WEBSOCKET_SERVER
    );

    socket.close();
  }
}
