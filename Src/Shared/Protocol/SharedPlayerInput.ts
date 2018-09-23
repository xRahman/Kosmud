/*
  Part of BrutusNEXT

  Part of client-server communication protocol.

  Player pressed something on the keyboard, clicked a mouse button etc.
*/

'use strict';

import {Packet} from '../../Shared/Protocol/Packet';

export abstract class SharedPlayerInput extends Packet
{
  constructor()
  {
    super();

    this.version = 0;
  }

  // ----------------- Public data ----------------------

  public type = SharedPlayerInput.Type.UNDEFINED;
}

// ------------------ Type declarations ----------------------

// Module is exported so you can use enum type from outside this file.
// It must be declared after the class because Typescript says so...
export module SharedPlayerInput
{
  /// TODO: Tohle zatím provizorně.
  export enum Type
  {
    UNDEFINED,
    KEY_DOWN,
    KEY_UP
  }
}