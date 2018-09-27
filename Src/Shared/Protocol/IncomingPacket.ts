/*
  Part of Kosmud

  Part of client-server communication protocol.
  Abstract ancestor of incoming data packet classes.
*/

import {Serializable} from '../../Shared/Class/Serializable';
import {Connection} from '../../Shared/Net/Connection';

export abstract class IncomingPacket extends Serializable
{
  public async abstract process(connection: Connection): Promise<void>;
}