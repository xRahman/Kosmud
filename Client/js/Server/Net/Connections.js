/*
  Part of BrutusNEXT

  Container storing id's of entities.
*/
define(["require", "exports", "../../Shared/ERROR", "../../Server/Application/Server"], function (require, exports, ERROR_1, Server_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    class Connections {
        constructor() {
            // ----------------- Private data ---------------------
            this.connectionList = new Set();
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
        // ------------- Public static methods ----------------
        static add(connection) {
            if (Server_1.Server.connections.connectionList.has(connection)) {
                ERROR_1.ERROR("Attempt to add connection which already "
                    + " exists in Connections");
                return;
            }
            Server_1.Server.connections.connectionList.add(connection);
        }
        static release(connection) {
            if (!Server_1.Server.connections.connectionList.has(connection)) {
                ERROR_1.ERROR("Attempt to release connection which doesn't"
                    + " exist in Connections");
                return;
            }
            Server_1.Server.connections.connectionList.delete(connection);
        }
    }
    exports.Connections = Connections;
});
//# sourceMappingURL=Connections.js.map