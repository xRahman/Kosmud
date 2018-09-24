/*
  Part of BrutusNEXT

  Part of client-server communication protocol.

  Description of change of scene contents which is sent to client.
*/

'use strict';

import {Packet} from '../../Shared/Protocol/Packet';

export abstract class SharedSceneUpdate extends Packet
{
  constructor()
  {
    super();

    this.version = 0;
  }

  // ----------------- Public data ----------------------

}

// ------------------ Type declarations ----------------------

// Module is exported so you can use enum type from outside this file.
// It must be declared after the class because Typescript says so...
// export module SharedSystemMessage
// {
// }