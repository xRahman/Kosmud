/*
  Part of Kosmud

  Part of client-server communication protocol.

  Information about player input activity (kepresses, mouse clicks etc.).
*/

'use strict';

import {Packet} from '../../Shared/Protocol/Packet';

export class PlayerInput extends Packet
{
  constructor(public type: PlayerInput.Type)
  {
    super();

    this.version = 0;
  }
}

// ------------------ Type declarations ----------------------

// Module is exported so you can use enum type from outside this file.
// It must be declared after the class because Typescript says so...
export module PlayerInput
{
  /// TODO: Tohle zatím provizorně.
  export enum Type
  {
    KEY_DOWN,
    KEY_UP
  }
}