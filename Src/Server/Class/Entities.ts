/*
  Part of Kosmud

  Static class that stores all entities.
*/

import { timeOfBoot } from "../../Server/KosmudServer";
import * as Entities  from "../../Shared/Class/Entities";
export *  from "../../Shared/Class/Entities";

// Counter of issued ids in this boot.
let lastIssuedId = 0;

// ! Throws exception on error.
export function newEntity
(
  // Either an entity id or a class name if you are instantiating
  // direcly from a hardcoded entity class.
  prototypeId: string
)
{
  const prototype = Entities.get(prototypeId);

  // ! Throws exception on error.
  return Entities.instantiateEntity(prototype, generateId());
}

// ----------------- Auxiliary Functions ---------------------

function generateId()
{
  // Increment lastIssuedId first so we start with 1 (initial value is 0).
  lastIssuedId++;

  // String id consists of radix-36 representation of lastIssuedId
  // and a radix-36 representation of current boot timestamp
  // (in miliseconds from the start of computer age) separated by dash ('-').
  // (radix 36 is used because it's a maximum radix toString() allows to use
  // and thus it leads to the shortest possible string representation of id)
  const idCounter = lastIssuedId.toString(36);
  const bootTime = timeOfBoot.getTime().toString(36);

  return `${idCounter}-${bootTime}`;
}