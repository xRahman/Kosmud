/*
  Part of Kosmud

  System message sent by client.

  (Part of client-server communication protocol.)
*/

import { Syslog } from "Shared/Log/Syslog";
import { Packet } from "Shared/Protocol/Packet";

export class SystemMessage extends Packet
{
  constructor
  (
    protected message: string,
    protected messageType: Syslog.MessageType
  )
  {
    super();
  }
}