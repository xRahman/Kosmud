/*
  Part of BrutusNEXT

  Part of client-server communication protocol.

  System message.
*/

'use strict';

import {Packet} from '../../Shared/Protocol/Packet';
// import {Classes} from '../../Shared/Class/Classes';

export abstract class SharedSystemMessage extends Packet
{
  constructor()
  {
    super();

    this.version = 0;
  }

  // ----------------- Public data ----------------------

  public type = SharedSystemMessage.Type.UNDEFINED;

  public message: (string | null) = null;
}

// ------------------ Type declarations ----------------------

// Module is exported so you can use enum type from outside this file.
// It must be declared after the class because Typescript says so...
export module SharedSystemMessage
{
  export enum Type
  {
    UNDEFINED,
    CLIENT_CLOSED_BROWSER_TAB
  }
}