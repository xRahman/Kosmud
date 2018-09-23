/*
  Part of Kosmud

  Stores constructors of dynamic classes so they can be instantiated
  in runtime.
*/

import {ERROR} from '../../Shared/ERROR';
import {Serializable} from '../../Shared/Class/Serializable';
//import {Entity} from '../../Shared/Class/Entity';
//import {Entities} from '../../Shared/Class/Entities';

/// This doesn't work in Typescript 2.4.1 anymore :\.
// // Type describing constructor of a Serializable class.
// type SerializableClass = new <T extends Serializable>(...args: any[]) => T;
// // Type describing constructor of an Entity class.
// type EntityClass = new <T extends Entity>(...args: any[]) => T;

// If you exclaim "WTF!" loudly after reading the next two lines of
// code, I absolutely aggree with you.
//   The point of this gibberish is to declare a type that describes
// any class (like Serializable) so you can call something like
// dynamicCast(Serializable). Regular classes in typescript are
// considered to be a constructor function, hence the 'new(...args): T'
// part on the right of '|' character. However, some classes can be
// abstract and in that case they don't have a constructor function
// because the whole point of abstract class is that it cannot be
// instantiated. So the type of an abstract class is a Function with
// a prototype with no constructor.
//   TLDR: this type describes both abstract and nonabstract classes.
export type AnyClass<T> =
  (Function & { prototype: T }) | { new (...args: any[]): T };

// Nonabstract class in javascript is it's constructor function.
export type NonabstractClass<T> = { new (...args: any[]): T };

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
    Class: NonabstractClass<T>
  )
  {
    this.serializables.set(Class.name, Class);
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
