/*
  Part of Kosmud

  Part of client-server communication protocol.
  Abstract ancestor of incoming data packet classes.
*/

import {Classes} from '../../Shared/Class/Classes';
import {Serializable} from '../../Shared/Class/Serializable';
import {PlayerInput} from '../../Shared/Protocol/PlayerInput';
import {SceneUpdate} from '../../Shared/Protocol/SceneUpdate';
import {SystemMessage} from '../../Shared/Protocol/SystemMessage';

export class Packet extends Serializable
{
  constructor(public data: Packet.Data)
  {
    super();

    this.version = 0;
  }
}

Classes.registerSerializableClass(Packet);

// ------------------ Type declarations ----------------------

// Module is exported so you can use enum type from outside this file.
// It must be declared after the class because Typescript says so...
export module Packet
{
  export type PlayerInputData =
  {
    type: "PlayerInput";
    content: PlayerInput;
  }

  export type SceneUpdateData =
  {
    type: "SceneUpdate";
    content: SceneUpdate;
  }

  export type SystemMessageData =
  {
    type: "SystemMessage";
    content: SystemMessage;
  }

  export type Data = PlayerInputData | SceneUpdateData | SystemMessageData;
}