/*
  Part of Kosmud

  Part of client-server communication protocol.

  Information about player input activity (kepresses, mouse clicks etc.).
*/

'use strict';

import {Classes} from '../../Shared/Class/Classes';
import {Serializable} from '../../Shared/Class/Serializable';

export interface PlayerInputInterface
{
  data: PlayerInputData;
}

export class PlayerInputData extends Serializable
{
  constructor(public type = PlayerInputData.Type)
  {
    super();

    this.version = 0;
  }
}

Classes.registerSerializableClass(PlayerInputData);

// ------------------ Type declarations ----------------------

// Module is exported so you can use enum type from outside this file.
// It must be declared after the class because Typescript says so...
export module PlayerInputData
{
  /// TODO: Tohle zatím provizorně.
  export enum Type
  {
    KEY_DOWN,
    KEY_UP
  }
}