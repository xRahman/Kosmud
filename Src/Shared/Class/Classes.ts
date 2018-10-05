/*
  Part of Kosmud

  Stores constructors of dynamic classes so they can be instantiated
  in runtime.
*/

import {Serializable} from '../../Shared/Class/Serializable';
import {Types} from '../../Shared/Utils/Types';

//import {Entity} from '../../Shared/Class/Entity';
//import {Entities} from '../../Shared/Class/Entities';

/// This doesn't work in Typescript 2.4.1 anymore :\.
// // Type describing constructor of a Serializable class.
// type SerializableClass = new <T extends Serializable>(...args: any[]) => T;
// // Type describing constructor of an Entity class.
// type EntityClass = new <T extends Entity>(...args: any[]) => T;

export class Classes
{
  // Classes extended from Serializable but not from Entity.
  public static serializables = new Map<string, new() => any>();

  // Classes extended from Entity.
  // (we keep Entity classes aside from other Serializable classes
  //  even though Entity is extended from Serializable because they
  //  are instantiated differently).
  public static entities = new Map<string, new() => any>();

  // ------------- Public static methods ----------------

  public static registerSerializableClass<T extends Serializable>
  (
    Class: Types.NonabstractClass<T>
  )
  {
    console.log("Registering class '" + Class.name + "'");

    this.serializables.set(Class.name, Class);
  }

  // ! Throws exception on error.
  public static instantiateSerializableClass(className: string)
  {
    let Class = Classes.serializables.get(className);

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

  // public static registerEntityClass<T extends Entity>
  // (
  //   Class: NonabstractClass<T>
  // )
  // {
  //   this.entities.set(Class.name, Class);
  // }


  // ------------- Private static methods ---------------
}
