/*
  Part of Kosmud

  Part of client-server communication protocol.

  System message.
*/

'use strict';

import {Classes} from '../../Shared/Class/Classes';
import {Serializable} from '../../Shared/Class/Serializable';

export class SystemMessage extends Serializable
{
  constructor
  (
    public type: SystemMessage.Type,
    public message: string
  )
  {
    super();

    this.version = 0;
  }
}

Classes.registerSerializableClass(SystemMessage);

// ------------------ Type declarations ----------------------

// Module is exported so you can use enum type from outside this file.
// It must be declared after the class because Typescript says so...
export module SystemMessage
{
  export type Type = "Client closed browser tab";

  // export enum Type
  // {
  //   CLIENT_CLOSED_BROWSER_TAB
  // }
}