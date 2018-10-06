/*
  Part of Kosmud

  Websocket server.
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

import {ERROR} from '../../Shared/Log/ERROR';
import {Syslog} from '../../Server/Log/Syslog';
import {MessageType} from '../../Shared/MessageType';
import {Connection} from '../../Server/Net/Connection';
import {Connections} from '../../Server/Net/Connections';

// 3rd party modules.
import * as WebSocket from 'ws';

// Built-in node.js modules.
import * as http from 'http';  // Import namespace 'http' from node.js.
import * as https from 'https';  // Import namespace 'http' from node.js.

export class WebSocketServer
{
  // ----------------- Public data ----------------------

  // ----------------- Private data ---------------------

  // Do we accept new connections?
  private open = false;

  private webSocketServer: (WebSocket.Server | "Not running") = "Not running";

  // ---------------- Public methods --------------------

  public isOpen() { return this.open; }

  // ! Throws exception on error.
  // Starts the websocket server inside a http server.
  public start(httpsServer: https.Server)
  {
    if (this.webSocketServer !== "Not running")
    {
      throw new Error("Failed to start websocket server"
        + " because it's already running");
    }

    Syslog.log("Starting websocket server", MessageType.SYSTEM_INFO);

    // Websocket server runs inside a http server so the same port can be used
    // (it is possible because WebSocket protocol is an extension of http).
    this.webSocketServer = new WebSocket.Server({ server: httpsServer });

    this.webSocketServer.on
    (
      'connection',
      (socket, request) => { this.onNewConnection(socket, request); }
    );

    // Unlike http server websocket server is up immediately so
    // we don't have to register handler for 'listening' event
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
    let ip = parseAddress(request);

    // Request.url is only valid for requests obtained from http.Server
    // (which should be our case).
    if (!request.url)
    {
      this.denyConnection(webSocket, "Invalid request.url", ip);

      ERROR("Invalid 'request.url'. This probably means that"
        + " websocket server is used outside of http server."
        + " Connection is denied");
      return;
    }

    let url = request.url;

    if (!this.isOpen())
    {
      this.denyConnection(webSocket, "Server is closed", ip, url);
      return;
    }

    this.acceptConnection(webSocket, ip, url);
  }

  // ---------------- Private methods --------------------

  private acceptConnection(webSocket: WebSocket, ip: string, url: string)
  {
    /// TODO: Connection by si asi mohly vyrobit Connections.
    /// (Zatím to nechám tady, Connections zas neznají správný WebSocket.
    ///  takže možná nakonec bude lepší nechat to tady).
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

// ----------------- Auxiliary Functions ---------------------

function parseAddress(request: http.IncomingMessage)
{
  if (!request.connection || !request.connection.remoteAddress)
    return "Unknown ip address";

  return request.connection.remoteAddress;
}