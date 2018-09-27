/*
  Part of BrutusNEXT

  Outgoing scene update packet.
*/

'use strict';

import {OutgoingPacket} from '../../Shared/Protocol/OutgoingPacket';
import {SceneUpdateData} from '../../Shared/Protocol/SceneUpdateData';
import {Classes} from '../../Shared/Class/Classes';

export class SceneUpdate extends OutgoingPacket
{
  constructor(public data: SceneUpdateData)
  {
    super();

    this.version = 0;
  }
}

Classes.registerSerializableClass(SceneUpdate);