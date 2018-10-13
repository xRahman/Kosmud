/*
  Part of Kosmud

  Stores constructors of dynamic classes so they can be instantiated
  in runtime.
*/

import {Serializable} from '../../Shared/Class/Serializable';
import {Types} from '../../Shared/Utils/Types';
import {Entity} from '../../Shared/Class/Entity';
import {Entities} from '../../Shared/Class/Entities';

export class Classes
{
  // This reference is here just to circumvent cyclic module dependancy
  // resulting from importing Entities to Serializable (it happens because
  // Entitites import Entity, which imports Serializable because it is
  // inherited from it).
  //   this variable is inicialized from Entities.ts.
  public static entities: Entities;

  // Classes extended from Serializable but not from Entity.
  public static serializableClasses = new Map<string, new() => any>();

  // Classes extended from Entity.
  // (we keep Entity classes aside from other Serializable classes
  //  even though Entity is extended from Serializable because they
  //  are instantiated differently).
  public static entityClasses = new Map<string, new() => any>();

  // ------------- Public static methods ----------------

  public static registerSerializableClass<T extends Serializable>
  (
    Class: Types.NonabstractClass<T>
  )
  {
    this.serializableClasses.set(Class.name, Class);
  }

  // ! Throws exception on error.
  public static instantiateSerializableClass(className: string)
  {
    let Class = Classes.serializableClasses.get(className);

    if (!Class)
    {
      throw new Error("Failed to instantiate class '" + className + "'"
        + " because it is not registered in Classes as a serializable"
        + " non-entity class");
    }

    let instance = new Class;

    if (!(instance instanceof Serializable))
    {
      throw new Error("Failed to instantiate class '" + className + "'"
        + " because it is not a Serializable class");
    }

    return instance;
  }

  public static registerEntityClass<T extends Entity>
  (
    Class: Types.NonabstractClass<T>
  )
  {
    this.entityClasses.set(Class.name, Class);
  }
}
