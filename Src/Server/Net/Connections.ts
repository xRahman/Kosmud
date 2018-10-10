/*
  Part of Kosmud

  Player connections.
*/

import {Packet} from '../../Shared/Protocol/Packet';
import {Connection} from '../../Server/Net/Connection';

// 3rd party modules.
// Use 'isomorphic-ws' to use the same code on both client and server.
import * as WebSocket from 'isomorphic-ws';
import { REPORT } from '../../Shared/Log/REPORT';

export class Connections
{
  // -------------- Private static data -----------------

  private static connections = new Set<Connection>();

  // ------------- Public static methods ----------------

  // ! Throws exception on error.
  public static removeConnection(connection: Connection)
  {
    if (!this.connections.has(connection))
    {
      throw new Error("Attempt to release connection"
        + " " + connection.getUserInfo() + "which doesn't"
        + " exist");
    }

    this.connections.delete(connection);
  }

  // ! Throws exception on error.
  public static addConnection(webSocket: WebSocket, ip: string, url: string)
  {
    let connection = new Connection(webSocket, ip, url);

    if (this.connections.has(connection))
    {
      throw new Error("Attempt to add connection which already"
        + " exists in Connections");
    }

    this.connections.add(connection);

    return connection;
  }

  public static broadcast(packet: Packet)
  {
    for (let connection of this.connections)
    {
      if (!connection.isOpen())
        continue;
      
      try
      {
        connection.send(packet);
      }
      catch (error)
      {
        REPORT("Failed to broadcast packet to connection"
          + " " + connection.getUserInfo());
      }
    }
  }
}