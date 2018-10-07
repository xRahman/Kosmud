/*
  Part of Kosmud

  Server-side websocket wrapper.
*/

import {ERROR} from '../../Shared/Log/ERROR';
import {Syslog} from '../../Shared/Log/Syslog';
import {Types} from '../../Shared/Utils/Types';
import {WebSocketEvent} from '../../Shared/Net/WebSocketEvent';
import {Connection} from '../../Server/Net/Connection';
import {MessageType} from '../../Shared/MessageType';
import * as Shared from '../../Shared/Net/Socket';
// import {AdminLevel} from '../../../shared/lib/admin/AdminLevel';

import * as WebSocket from 'isomorphic-ws';

// Built-in node.js modules.
// import * as net from 'net';  // Import namespace 'net' from node.js
// import * as events from 'events';  // Import namespace 'events' from node.js

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

  // -------------- Static class data -------------------

  // ----------------- Private data ---------------------

  // ----------------- Public data ----------------------

  ///public connection: (Connection | null) = null;

  // --------------- Public accessors -------------------

  public getIpAddress(): string
  {
    return this.ip;
  }

  public getOrigin()
  {
    return "(" + this.url + " [" + this.ip + "])";
  }

  // ---------------- Public methods --------------------

  // -------------- Protected methods -------------------

  // --------------- Private methods --------------------

  // ---------------- Event handlers --------------------
}