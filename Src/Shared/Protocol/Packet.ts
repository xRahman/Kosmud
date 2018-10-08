/*
  Part of Kosmud

  Part of client-server communication protocol.
  Abstract ancestor of incoming data packet classes.
*/

import {Serializable} from '../../Shared/Class/Serializable';
import {PacketHandler} from '../../Shared/Net/PacketHandler';

export class Packet extends Serializable
{
  public async process(connection: PacketHandler): Promise<void>
  {
    // Packet.process isn't abstract, because than it would be necessary
    // to implement both server-side and client-side version of all packet
    // classes even though they are only processed on one side.
    //   Clean solution without process() method on classes that don't need
    // it would require multiple inheritance.
    throw new Error("This method needs to be overriden in descendant class");
  }
}