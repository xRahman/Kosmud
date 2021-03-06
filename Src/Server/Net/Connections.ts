/*  Part of Kosmud  */

import { REPORT } from "../../Shared/Log/REPORT";
import { Packet } from "../../Shared/Protocol/Packet";
import { Connection } from "../../Server/Net/Connection";

// 3rd party modules.
// Use 'isomorphic-ws' to use the same code on both client and server.
import * as WebSocket from "isomorphic-ws";

const connections = new Set<Connection>();

export namespace Connections
{
  // ! Throws exception on error.
  export function removeConnection(connection: Connection)
  {
    if (!connections.has(connection))
    {
      throw Error(`Attempt to release connection`
        + ` ${connection.getPlayerInfo()} which doesn't exist`);
    }

    connections.delete(connection);
  }

  // ! Throws exception on error.
  export function newConnection(webSocket: WebSocket, ip: string, url: string)
  {
    const connection = new Connection(webSocket, ip, url);

    if (connections.has(connection))
    {
      throw Error("Attempt to add connection which already"
        + " exists in Connections");
    }

    connections.add(connection);

    return connection;
  }

  export function broadcast(packet: Packet)
  {
    for (const connection of connections)
    {
      if (!connection.isOpen())
        continue;

      try
      {
        connection.send(packet);
      }
      catch (error)
      {
        REPORT(error, `Failed to broadcast packet to connection`
          + ` ${connection.getPlayerInfo()}`);
      }
    }
  }

  // ! Throws exception on error.
  export function updateClients()
  {
    for (const connection of connections)
    {
      if (!connection.isOpen())
        continue;

      // ! Throws exception on error.
      connection.updateClient();
    }
  }
}