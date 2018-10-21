/*
  Part of Kosmud

  Information about mouse input activity.

  (Part of client-server communication protocol.)
*/

import { Vector } from "Shared/Physics/Vector";
import { Packet } from "Shared/Protocol/Packet";

export class MouseInput extends Packet
{
  constructor(protected mousePosition: Vector)
  {
    super();
  }
}

// ------------------ Type declarations ----------------------

// Module is exported so you can use enum type from outside this file.
// It must be declared after the class because Typescript says so...
// export module MouseInput
// {
// }