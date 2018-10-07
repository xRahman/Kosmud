/*
  Part of Kosmud

  Ancestor of Connection (and Socket) classes.
*/

import {REPORT} from '../../Shared/Log/REPORT';
import {Serializable} from '../../Shared/Class/Serializable';
import {Packet} from '../../Shared/Protocol/Packet';

export abstract class Connection
{
  public async receiveData(data: string)
  {
    let packet: Packet;

    try
    {
      packet = Serializable.deserialize(data).dynamicCast(Packet);
    }
    catch (error)
    {
      REPORT(error, "Failed to deserialize incoming packet");
      return;
    }

    try
    {
      await packet.process(this);
    }
    catch (error)
    {
      REPORT(error, "Failed to process incoming packet");
    }
  }
}