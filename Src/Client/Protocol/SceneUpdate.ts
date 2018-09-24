/*
  Part of BrutusNEXT

  Client-side version of system message packet.
*/

'use strict';

import {Classes} from '../../Shared/Class/Classes';
import {SharedSceneUpdate} from '../../Shared/Protocol/SharedSceneUpdate';

export class SceneUpdate extends SharedSceneUpdate
{
  constructor()
  {
    super();

    this.version = 0;
  }

  ///?
  // This class is empty, all functionality is inherited from
  // ancestor. It only exists to be added to Classes so it can
  // be be dynamically instantiated.
}

Classes.registerSerializableClass(SceneUpdate);