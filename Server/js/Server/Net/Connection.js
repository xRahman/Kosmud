/*
  Part of BrutusNEXT

  A connection to the server.
*/
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ERROR_1 = require("../../Shared/ERROR");
const REPORT_1 = require("../../Shared/REPORT");
const Serializable_1 = require("../../Shared/Class/Serializable");
const Message_1 = require("../../Server/Net/Message");
const MessageType_1 = require("../../Shared/MessageType");
const ServerSocket_1 = require("../../Server/Net/ServerSocket");
const Connections_1 = require("../../Server/Net/Connections");
const Packet_1 = require("../../Shared/Protocol/Packet");
/// TODO: Tak v Connection bych tohle opravdu nehledal...
/// (Navíc to očividně typescript nekontroluje...)
// Force module import (so that the module code is assuredly executed
// instead of typescript just registering a type). This ensures that
// class constructor is added to Classes so it can be deserialized.
require("../../../server/lib/protocol/Command");
require("../../../server/lib/protocol/SystemMessage");
require("../../../server/lib/protocol/LoginRequest");
require("../../../server/lib/protocol/RegisterRequest");
require("../../../server/lib/protocol/ChargenRequest");
require("../../../server/lib/protocol/EnterGameRequest");
class Connection {
    constructor(webSocket, ip, url) {
        this.socket = new ServerSocket_1.ServerSocket(this, webSocket, ip, url);
    }
    // ----------------- Private data ---------------------
    /// Disabled for now.
    // private account: (Account | null) = null;
    // --------------- Public accessors -------------------
    /// Disabled for now.
    // public setAccount(account: Account | null)
    // {
    //   this.account = account;
    // }
    /// Disabled for now.
    // ! Throws an exception on error.
    // public getAccount(): Account
    // {
    //   if (!this.account || !this.account.isValid())
    //     throw new Error("Attempt to access invalid account on connection");
    //   return this.account;
    // }
    getIpAddress() { return this.socket.getIpAddress(); }
    // Connection origin description in format "(url [ip])".
    getOrigin() { return this.socket.getOrigin(); }
    getUserInfo() {
        let info = "";
        /// Disabled for now.
        // if (this.account)
        //   info += this.account.getEmail() + " ";
        // Add (url [ip]).
        info += this.getOrigin();
        return info;
    }
    // ---------------- Public methods --------------------
    // Closes the connection and removes it from memory
    // (this is not possible if it is still linked to an
    //  account).
    close() {
        /// Disabled for now.
        // if (this.account !== null)
        // {
        //   ERROR("Attempt to close connection that is still linked"
        //     + " to account (" + this.account.getErrorIdString() + ")."
        //     + " Connection is not closed");
        //   return;
        // }
        if (!this.socket) {
            ERROR_1.ERROR("Unable to close connection because it has no socket"
                + " attached. Removing it from Connections");
            Connections_1.Connections.release(this);
            return;
        }
        if (!this.socket.close()) {
            // If socket can't be closed (websocket is missing
            // or it's already CLOSED), release the connection
            // from memory. If it can be closed, 'onClose' event
            // will be triggered and it's handler will release
            // the connection.
            Connections_1.Connections.release(this);
        }
    }
    /// Disabled for now.
    // public attachToGameEntity(gameEntity: GameEntity)
    // {
    //   this.ingameEntity = gameEntity;
    //   gameEntity.connection = this;
    // }
    /// Disabled for now.
    // public detachFromGameEntity()
    // {
    //   if (this.account === null)
    //   {
    //     ERROR("Unexpected 'null' value");
    //     return;
    //   }
    //   if (this.ingameEntity === null)
    //   {
    //     ERROR("Attempt to detach ingame entity"
    //       + " from " + this.account.getName() + "'s"
    //       + " player connection when there is"
    //       + " no ingame entity attached to it");
    //   }
    //   if (this.ingameEntity === null)
    //   {
    //     ERROR("Unexpected 'null' value");
    //     return;
    //   }
    //   this.ingameEntity.detachConnection();
    // }
    /// Disabled for now.
    // public sendMudMessage(message: Message)
    // {
    //   if (message === null || message === undefined)
    //   {
    //     ERROR("Invalid message");
    //     return;
    //   }
    //   let packet = new MudMessage();
    //   let composedMessage = message.compose()
    //   if (composedMessage === null)
    //     return;
    //   packet.message = composedMessage;
    //   this.send(packet);
    // }
    // Processes data received from the client.
    receiveData(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let deserializedPacket = Serializable_1.Serializable.deserialize(data);
            if (!deserializedPacket)
                return;
            let packet = deserializedPacket.dynamicCast(Packet_1.Packet);
            if (packet === null)
                return;
            yield packet.process(this);
        });
    }
    // Sends 'packet' to web socket.
    send(packet) {
        /// TODO: packet.serialize() sice zatím nevyhazuje výjimky,
        /// ale časem bude.
        try {
            this.socket.send(packet.serialize(Serializable_1.Serializable.Mode.SEND_TO_CLIENT));
        }
        catch (error) {
            REPORT_1.REPORT(error, "Packet is not sent");
        }
    }
    announceReconnect() {
        let message = new Message_1.Message("Someone (hopefully you) has just logged into this account"
            + " from different location. Closing this connection.", MessageType_1.MessageType.CONNECTION_INFO);
        /// Disabled for now.
        // this.sendMudMessage(message);
    }
    // --------------- Private methods --------------------
    // ---------------- Event handlers --------------------
    // Releases the connection from memory
    // (should be called from 'onClose' event on socket).
    release() {
        /// Disabled for now.
        // // It's ok if account doesn't exist here, it happens
        // // when brower has opened connection but player hasn't
        // // logged in yet or when player reconnects from different
        // // location and the old connection is closed.
        // if (this.account)
        // {
        //   this.account.logout();
        //   this.account = null;
        // }
        // Release this connection from memory.
        Connections_1.Connections.release(this);
    }
}
exports.Connection = Connection;
//# sourceMappingURL=Connection.js.map