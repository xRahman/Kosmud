/*
  Part of BrutusNEXT

  Part of client-server communication protocol.
  Abstract ancestor of data packet classes.
*/

'use strict';

import {ERROR} from '../../Shared/ERROR';
import {Serializable} from '../../Shared/Class/Serializable';
import {Connection} from '../../Shared/Net/Connection';

export abstract class Packet extends Serializable
{
  public async process(connection: Connection): Promise<void>
  {
    ERROR("Attempt to process() a packet which is"
      + " not supposed to be processed");
  }
}