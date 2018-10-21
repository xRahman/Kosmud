/*
  Part of Kosmud

  Stores constructors of dynamic classes so they can be instantiated
  in runtime.
*/

import { Serializable } from "Shared/Class/Serializable";
import { Types } from "Shared/Utils/Types";
import { Entity } from "Shared/Class/Entity";
import { Entities } from "Shared/Class/Entities";

// Classes extended from Serializable but not from Entity.
const serializableClasses = new Map<string, new() => any>();

// Classes extended from Entity.
// (we keep Entity classes aside from other Serializable classes
//  even though Entity is extended from Serializable because they
//  are instantiated differently).
const entityClasses = new Map<string, new() => any>();

export namespace Classes
{
  // This reference is here just to circumvent cyclic module dependancy
  // resulting from importing Entities to Serializable (it happens because
  // Entitites import Entity, which imports Serializable because it is
  // inherited from it).
  //   this variable is inicialized from Entities.ts.
  export let entities: Entities;

  // ------------- Public static methods ----------------

  export function getSerializableClass(name: string)
  {
    return serializableClasses.get(name);
  }

  export function getEntityClass(name: string)
  {
    return entityClasses.get(name);
  }

  export function registerSerializableClass<T extends Serializable>
  (
    Class: Types.NonabstractClass<T>
  )
  {
    serializableClasses.set(Class.name, Class);
  }

  // ! Throws exception on error.
  export function instantiateSerializableClass(className: string)
  {
    const Class = serializableClasses.get(className);

    if (!Class)
    {
      throw new Error(`Failed to instantiate class '${className}'`
        + ` because it is not registered in Classes as a serializable`
        + ` non-entity class`);
    }

    let instance: new() => any;

    try
    {
      instance = new Class();
    }
    catch (error)
    {
      error.message += ")\n";
      error.message += `(Note: If you see something like "Cannot`
        + ` read property 'xy' of undefined" in the error message,`
        + ` it probably means that you are accessing a parameter in`
        + ` constructor of class '${className}'. That's not possible`
        + ` in Serializable classes, unfortunately, because when they`
        + ` are deserialized, an empty instance is created first`
        + ` (and constructor is called without parameters at that time`
        + ` and the properties are set later in deserialize(). Basicaly`
        + ` it means that parameters in constructors of Serializable`
        + ` classes are undefined when deserializing and you need to`
        + ` handle it.`;
      throw error;
    }

    if (!(instance instanceof Serializable))
    {
      throw new Error(`Failed to instantiate class '${className}'`
        + ` because it is not a Serializable class`);
    }

    return instance;
  }

  export function registerEntityClass<T extends Entity>
  (
    Class: Types.NonabstractClass<T>
  )
  {
    entityClasses.set(Class.name, Class);
  }
}
