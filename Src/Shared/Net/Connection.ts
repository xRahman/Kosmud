/*
  Part of Kosmud

  Shared ancestor of Connection classes.
*/

import {REPORT} from '../../Shared/Log/REPORT';
import {Serializable} from '../../Shared/Class/Serializable';
import {Packet} from '../../Shared/Protocol/Packet';

export abstract class Connection
{
  public async receiveData(data: string)
  {
    // Note:
    //   We use REPORT() here because this function is almost
    //   entry-level so there is no point in throwing exceptions
    //   from here (they would just get reported as uncaught).

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