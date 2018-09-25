/*
  Part of BrutusNEXT

  Connection to the server.
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "../../Shared/ERROR", "../../Shared/Class/Serializable", "../../Client/Application/Client", "../../Client/Net/ClientSocket", "../../Shared/Protocol/IncomingPacket", "../../Client/Protocol/SystemMessage", "../../Shared/Protocol/SystemMessageData", "../../Client/Protocol/SceneUpdate", "../../Shared/Protocol/SceneUpdateData", "../../Client/Protocol/PlayerInput", "../../Shared/Protocol/PlayerInputData"], function (require, exports, ERROR_1, Serializable_1, Client_1, ClientSocket_1, IncomingPacket_1, SystemMessage_1, SystemMessageData_1, SceneUpdate_1, SceneUpdateData_1, PlayerInput_1, PlayerInputData_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    // import {Account} from '../../../client/lib/account/Account';
    // import {Character} from '../../../client/game/character/Character';
    /// TODO: Tohohle se zbavit.
    // Force module import (so that the module code is assuredly executed
    // instead of typescript just registering a type). This ensures that
    // class constructor is added to Classes so it can be deserialized.
    // import '../../../shared/lib/protocol/Move';
    // import '../../../client/game/world/Room';
    // import '../../../client/lib/protocol/LoginResponse';
    // import '../../../client/lib/protocol/RegisterResponse';
    // import '../../../client/lib/protocol/ChargenResponse';
    // import '../../../client/lib/protocol/EnterGameResponse';
    SystemMessage_1.SystemMessage;
    SystemMessageData_1.SystemMessageData;
    SceneUpdate_1.SceneUpdate;
    SceneUpdateData_1.SceneUpdateData;
    PlayerInput_1.PlayerInput;
    PlayerInputData_1.PlayerInputData;
    class Connection {
        constructor() {
            this.socket = null;
        }
        // -------------- Static class data -------------------
        // ----------------- Public data ----------------------
        /// Disabled for now.
        // public activeAvatar: (Avatar | null) = null;
        // ----------------- Private data ---------------------
        /// Disabled for now.
        // private account: (Account | null) = null;
        /// Disabled for now.
        // private avatars = new Set<Avatar>();
        // --------------- Static accessors -------------------
        /// Disabled for now.
        // public static get account()
        // {
        //   let connection = Client.connection;
        //   if (!connection)
        //   {
        //     ERROR("Missing or invalid connection");
        //     return;
        //   }
        //   return connection.account;
        // }
        // ---------------- Static methods --------------------
        static send(packet) {
            let connection = Client_1.Client.connection;
            if (!connection) {
                ERROR_1.ERROR("Missing or invalid connection. Packet is not sent");
                return;
            }
            connection.send(packet);
        }
        /// Disabled for now.
        // public setAccount(account: Account)
        // {
        //   if (!account || !account.isValid())
        //   {
        //     ERROR("Attempt to set invalid account to the connection."
        //       + " Account is not set.");
        //     return;
        //   }
        //   if (this.account !== null)
        //   {
        //     ERROR("Attempt to set account " + account.getErrorIdString()
        //       + " to the connection when there already is an account set."
        //       + " Account can only be set to the connection once");
        //   }
        //   this.account = account;
        // }
        /// Disabled for now.
        // public getAccount() {  return this.account; }
        // ---------------- Public methods --------------------
        /// TODO: Na serveru je prakticky stejná fce, asi by to chtělo sloučit
        /// do společného předka v /shared
        receiveData(data) {
            return __awaiter(this, void 0, void 0, function* () {
                /// TODO: deserialize() by mělo házet exception místo return null,
                /// takže pak půjde zavolat:
                ///   let packet = Serializable.deserialize(data).dynamicCast(Packet);
                let deserializedPacket = Serializable_1.Serializable.deserialize(data);
                if (!deserializedPacket)
                    return;
                let packet = deserializedPacket.dynamicCast(IncomingPacket_1.IncomingPacket);
                if (packet !== null)
                    yield packet.process(this);
            });
        }
        /// Disabled for now.
        // public createAvatar(character: Character): Avatar
        // {
        //   let avatar = new Avatar(character);
        //   this.avatars.add(avatar);
        //   // Newly created avatar is automaticaly set as active
        //   // (this should only happen when player logs in with
        //   //  a new character).
        //   this.activeAvatar = avatar;
        //   return avatar;
        // }
        // Attempts to open the websocket connection.
        connect() {
            if (this.socket !== null)
                ERROR_1.ERROR("Socket already exists");
            this.socket = new ClientSocket_1.ClientSocket(this);
            this.clientMessage('Opening websocket connection...');
            this.socket.connect();
        }
        /// Disabled for now.
        // // Sends 'command' to the connection.
        // public sendCommand(command: string)
        // {
        //   let packet = new Command();
        //   packet.command = command;
        //   if (!this.socket)
        //   {
        //     ERROR("Unexpected 'null' value");
        //     return
        //   }
        //   // If the connection is closed, any user command
        //   // (even an empty one) triggers reconnect attempt.
        //   if (!this.socket.isOpen())
        //     this.socket.reConnect();
        //   else
        //     this.send(packet);
        // }
        // Sends system message to the connection.
        sendSystemMessage(type, message) {
            let packet = new SystemMessage_1.SystemMessage(new SystemMessageData_1.SystemMessageData(type, message));
            this.send(packet);
        }
        /// Disabled for now.
        // // Receives 'message' from the connection
        // // (appends it to the output of respective scrollwindow).
        // public receiveMudMessage(message: string)
        // {
        //   if (this.activeAvatar)
        //     this.activeAvatar.receiveMessage(message);
        // }
        // Outputs a client system message.
        clientMessage(message) {
            /// Disabled for now.
            // if (this.activeAvatar)
            //   this.activeAvatar.clientMessage(message);
        }
        reportClosingBrowserTab() {
            this.sendSystemMessage("Client closed browser tab", "");
        }
        close(reason = null) {
            if (this.socket)
                this.socket.close(reason);
        }
        // ---------------- Event handlers --------------------
        // ---------------- Private methods -------------------
        send(packet) {
            if (!this.socket) {
                ERROR_1.ERROR("Unexpected 'null' value");
                return;
            }
            if (!this.socket.isOpen()) {
                ERROR_1.ERROR("Attempt to send packet to the closed connection");
                return;
            }
            this.socket.send(packet.serialize(Serializable_1.Serializable.Mode.SEND_TO_SERVER));
        }
    }
    exports.Connection = Connection;
});
//# sourceMappingURL=Connection.js.map