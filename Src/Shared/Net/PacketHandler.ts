/*
  Part of Kosmud

  Deserializes and processes packets.
*/

import {REPORT} from '../../Shared/Log/REPORT';
import {Serializable} from '../../Shared/Class/Serializable';
import {Packet} from '../../Shared/Protocol/Packet';

export abstract class PacketHandler
{
  // ---------------- Public methods --------------------

  public async deserializeAndProcessPacket(data: string)
  {
    /// DEBUG:
    console.log(data);

    let packet: Packet;

    try
    {
      packet = Serializable.deserialize(data).dynamicCast(Packet);
    }
    catch (error)
    {
      REPORT(error, "Failed to deserialize incoming packet."
        + " Packet is not procesed");
      return;
    }

    await this.processPacket(packet);
  }

  // --------------- Protected methods ------------------

  protected abstract send(packet: Packet): void;

  // ---------------- Private methods -------------------

  private async processPacket(packet: Packet)
  {
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