/*
  Part of Kosmud

  Stores client connections.
*/


import {ERROR} from '../../Shared/Log/ERROR';
// import {Entity} from '../../Shared/Class/Entity';
// import {Admins} from '../../../server/lib/admin/Admins';
import {Packet} from '../../Shared/Protocol/Packet';
import {Connection} from '../../Server/Net/Connection';
// import {Message} from '../../Server/Net/Message';
// import {Server} from '../../Server/Application/Server';

export class Connections
{
  // ----------------- Private data ---------------------

  private static connections = new Set<Connection>();

  // ------------- Public static methods ----------------

  // ! Throws exception on error.
  public static release(connection: Connection)
  {
    if (!this.connections.has(connection))
    {
      throw new Error("Attempt to release connection"
        + " " + connection.getUserInfo + "which doesn't"
        + " exist");
    }

    this.connections.delete(connection);
  }

  /// TODO: Zatím public
  public static add(connection: Connection)
  {
    if (this.connections.has(connection))
    {
      ERROR("Attempt to add connection which already "
        + " exists in Connections");
      return;
    }

    this.connections.add(connection);
  }

  public static broadcast(packet: Packet)
  {
    for (let connection of this.connections)
    {
      if (connection.isOpen())
        connection.send(packet);
    }
  }

  /// TODO (zatím odloženo)
  // public static createConnection
  // (
  //   webSocket: WebSocket,
  //   ip: string,
  //   url: string
  // )
  // : Connection
  // {
  //   let connection = new Connection(webSocket, ip, url);

  //   Connections.add(connection);

  //   return connection;
  // }

  /// Disabled for now.
  // // Sends a message to all connections.
  // // If 'visibility' is not 'null', message is only sent to connections
  // // with valid ingame entity with sufficient AdminLevel.
  // //public static send(message: Message, visibility: (AdminLevel | null) = null)
  // public static send(message: Message)
  // {
  //   for (let connection of Server.connections.connectionList)
  //   {
  //     if (visibility !== null)
  //     {
  //       if (!connection.ingameEntity || !connection.ingameEntity.isValid())
  //         continue;

  //       const adminLevel = Admins.getAdminLevel(connection.ingameEntity);

  //       if (adminLevel === null)
  //       {
  //         ERROR("Unexpected 'null' value");
  //         continue;
  //       }

  //       // Skip game entities that don't have sufficient admin level
  //       // to see this message.
  //       if (adminLevel < visibility)
  //         continue;
  //     }

  //     message.sendToConnection(connection);
  //   }
  // }

  // ------------- Private static methods ---------------
}