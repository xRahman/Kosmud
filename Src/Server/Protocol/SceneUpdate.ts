/*
  Part of BrutusNEXT

  Outgoing scene update packet.
*/

'use strict';

import {OutgoingPacket} from '../../Shared/Protocol/OutgoingPacket';
import {SceneUpdateInterface} from '../../Shared/Protocol/SceneUpdateData';
import {SceneUpdateData} from '../../Shared/Protocol/SceneUpdateData';
import {Classes} from '../../Shared/Class/Classes';

export class SceneUpdate
  extends OutgoingPacket
  implements SceneUpdateInterface
{
  constructor(public data: SceneUpdateData)
  {
    super();

    this.version = 0;
  }
}

Classes.registerSerializableClass(SceneUpdate);