/*
  Part of Kosmud

  Server-side websocket wrapper.
*/

import * as Shared from '../../Shared/Net/Socket';

// 3rd party modules.
// Use 'isomorphic-ws' to be able to use the same code
// on both client and server.
import * as WebSocket from 'isomorphic-ws';

export class Socket extends Shared.Socket
{
  constructor
  (
    webSocket: WebSocket,
    private ip: string,
    private url: string
  )
  {
    super(webSocket);
  }
  // ---------------- Public methods --------------------

  public getIpAddress(): string
  {
    return this.ip;
  }

  public getOrigin()
  {
    return "(" + this.url + " [" + this.ip + "])";
  }
}