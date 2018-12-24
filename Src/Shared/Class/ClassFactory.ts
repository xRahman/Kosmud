/*
  Part of Kosmud

  Stores constructors of dynamic classes so they can be instantiated
  in runtime.
*/

import { Serializable } from "../../Shared/Class/Serializable";
import { Types } from "../../Shared/Utils/Types";
// import { Entity } from "../../Shared/Class/Entity";
import { Entities } from "../../Shared/Class/Entities";

// Key should be either entity id or a class name.
const prototypes = new Map<string, Serializable>();

export namespace ClassFactory
{
  /// Zatím to tu nechám. Uvidíme, jestli to bude potřeba.
  // This reference is here just to circumvent cyclic module dependancy
  // resulting from importing Entities to Serializable (it happens because
  // Entitites import Entity, which imports Serializable because it is
  // inherited from it).
  //   this variable is inicialized from Entities.ts.
  export let entities: Entities;

  // ------------- Public static methods ----------------

  // ! Throws exception on error.
  export function instantiate
  (
    // Class name (in case of Serializables) or entity id.
    prototypeName: string
  )
  {
    // ! Throws exception on error.
    const prototype = getPrototype(prototypeName);

    /// TODO: Zvážit true prototypovou dědičnost jako u entit
    ///   (tam ji ostatně budu muset řešit).
    return Object.create(prototype);
  }

  export function registerClassPrototype<T extends Serializable>
  (
    Class: Types.NonabstractClass<T>
  )
  {
    register(Class.name, new Class());
  }

  // ! Throws exception on error.
  export function register(prototypeName: string, prototype: Serializable)
  {
    if (!prototypeName)
    {
      throw new Error(`Failed to register a prototype in the class`
      + ` factory because provided name is not a valid nonempty string`);
    }

    if (prototypes.has(prototypeName))
    {
      throw new Error(`Failed to register prototype '${prototypeName}'`
        + ` because there already is a prototype registered under this`
        + ` name in the class factory`);
    }

    prototypes.set(prototypeName, prototype);
  }
}

// ----------------- Auxiliary Functions ---------------------

// ! Throws exception on error.
function getPrototype(prototypeName: string)
{
  const prototype = prototypes.get(prototypeName);

  if (prototype === undefined)
  {
    throw new Error(`Prototype '${prototypeName}'`
      + ` is not registered in the class factory`);
  }

  return prototype;
}