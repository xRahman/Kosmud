/*
  Part of Kosmud

  Player connections.
*/


// import {Entity} from '../../Shared/Class/Entity';
// import {Admins} from '../../../server/lib/admin/Admins';
import {Packet} from '../../Shared/Protocol/Packet';
import {Connection} from '../../Server/Net/Connection';

// 3rd party modules.
// Use 'isomorphic-ws' to be able to use the same code
// on both client and server.
import * as WebSocket from 'isomorphic-ws';
import { REPORT } from '../../Shared/Log/REPORT';

export class Connections
{
  // ----------------- Private data ---------------------

  private static connections = new Set<Connection>();

  // ------------- Public static methods ----------------

  // ! Throws exception on error.
  public static remove(connection: Connection)
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

  // ! Throws exception on error.
    this.add(connection);

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

  // ------------- Private static methods ---------------

  // ! Throws exception on error.
  private static add(connection: Connection)
  {
    if (this.connections.has(connection))
    {
      throw new Error("Attempt to add connection which already"
        + " exists in Connections");
    }

    this.connections.add(connection);
  }
}