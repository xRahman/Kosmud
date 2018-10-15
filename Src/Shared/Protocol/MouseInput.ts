/*
  Part of Kosmud

  Information about mouse input activity.

  (Part of client-server communication protocol.)
*/

import {Packet} from '../../Shared/Protocol/Packet';

export class MouseInput extends Packet
{
  constructor(protected x: number, protected y: number)
  {
    super();

    this.version = 0;
  }
}

// ------------------ Type declarations ----------------------

// Module is exported so you can use enum type from outside this file.
// It must be declared after the class because Typescript says so...
// export module MouseInput
// {
// }