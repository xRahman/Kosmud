/*  Part of Kosmud  */

import { Vector } from "../../Shared/Physics/Vector";
import { Packet } from "../../Shared/Protocol/Packet";

export class MouseInput extends Packet
{
  public mousePosition: Vector | undefined = undefined;
}

// ------------------ Type declarations ----------------------

// Namespace is exported so you can use enum type from outside this file.
// It must be declared after the class because Typescript says so...
// export module MouseInput
// {
// }