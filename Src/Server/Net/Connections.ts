/*
  Part of BrutusNEXT

  Container storing id's of entities.
*/

'use strict';

import {ERROR} from '../../Shared/ERROR';
// import {Entity} from '../../Shared/Class/Entity';
// import {Admins} from '../../../server/lib/admin/Admins';
import {Connection} from '../../Server/Net/Connection';
import {Message} from '../../Server/Net/Message';
import {Server} from '../../Server/Application/Server';

export class Connections
{
  // ----------------- Private data ---------------------

  private connectionList = new Set<Connection>();

  // ------------- Public static methods ----------------

  public static add(connection: Connection)
  {
    if (Server.connections.connectionList.has(connection))
    {
      ERROR("Attempt to add connection which already "
        + " exists in Connections");
      return;
    }

    Server.connections.connectionList.add(connection);
  }

  public static release(connection: Connection)
  {
    if (!Server.connections.connectionList.has(connection))
    {
      ERROR("Attempt to release connection which doesn't"
        + " exist in Connections");
      return;
    }

    Server.connections.connectionList.delete(connection);
  }

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