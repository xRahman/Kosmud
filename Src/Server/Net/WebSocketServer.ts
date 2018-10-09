/*
  Part of Kosmud

  Websocket server.
*/

import {ERROR} from '../../Shared/Log/ERROR';
import {Syslog} from '../../Server/Log/Syslog';
import {MessageType} from '../../Shared/MessageType';
import {Connection} from '../../Server/Net/Connection';
import {Connections} from '../../Server/Net/Connections';

// 3rd party modules.
// Use 'isomorphic-ws' to use the same code on both client and server.
import * as WebSocket from 'isomorphic-ws';

// Built-in node.js modules.
import * as http from 'http';  // Import namespace 'http' from node.js.
import * as https from 'https';  // Import namespace 'http' from node.js.
import { REPORT } from '../../Shared/Log/REPORT';

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
  public startInsideHttpsServer(httpsServer: https.Server)
  {
    if (this.webSocketServer !== "Not running")
    {
      throw new Error("Failed to start websocket server"
        + " because it's already running");
    }

    Syslog.log("Starting websocket server", MessageType.SYSTEM_INFO);

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
    let url = request.url;

    // Request.url is only valid for requests obtained from http.Server
    // (which should be our case).
    if (!url)
    {
      this.denyConnection(webSocket, "Invalid request.url", ip);

      ERROR("Invalid 'request.url'. This probably means that"
        + " websocket server is used outside of http server."
        + " Connection is denied");
      return;
    }

    if (!this.isOpen())
    {
      this.denyConnection(webSocket, "Server is closed", ip, url);
      return;
    }

    try
    {
      this.acceptConnection(webSocket, ip, url);
    }
    catch (error)
    {
      Syslog.reportUncaughtException(error);
    }
  }

  // ---------------- Private methods --------------------

  private acceptConnection(webSocket: WebSocket, ip: string, url: string)
  {
    let connection: Connection;

    try
    {
      connection = Connections.addConnection(webSocket, ip, url);
    }
    catch (error)
    {
      REPORT(error, "Failed to accept connection");
      return;
    }

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