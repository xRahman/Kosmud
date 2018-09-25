/*
  Part of Kosmud

  Part of client-server communication protocol.

  Description of change of scene contents which is sent to client.
*/

'use strict';

import {Classes} from '../../Shared/Class/Classes';
import {Serializable} from '../../Shared/Class/Serializable';

export interface SceneUpdateInterface
{
  data: SceneUpdateData;
}

export class SceneUpdateData extends Serializable
{
  constructor()
  {
    super();

    this.version = 0;
  }

  // ----------------- Public data ----------------------

}

Classes.registerSerializableClass(SceneUpdateData);

// ------------------ Type declarations ----------------------

// Module is exported so you can use enum type from outside this file.
// It must be declared after the class because Typescript says so...
// export module SceneUpdateData
// {
// }