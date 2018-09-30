/*
  Part of Kosmud

  Types and associated utility functions.
*/

import {Serializable} from '../Shared/Class/Serializable';

// Types used for constructs like 'new Promise((resolve, reject) => { ... })'.
export type ResolveFunction<T> = (value?: T | PromiseLike<T>) => void;
export type RejectFunction = (reason?: any) => void;

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

export module Types
{
  // -> Returns 'true' if 'variable' is of type string.
  export function isString(variable: any): boolean
  {
    return typeof variable === 'string';
  }

  // -> Returns 'true' if 'variable' is of type 'FastBitSet'.
  export function isBitvector(variable: any)
  {
    if (variable === null || variable === undefined || !variable.constructor)
      return false;

    return variable.constructor.name === 'FastBitSet';
  }

  // -> Returns 'true' if 'variable' is of type 'Date'.
  export function isDate(variable: any)
  {
    if (variable === null || variable === undefined || !variable.constructor)
      return false;

    return variable.constructor.name === 'Date';
  }

  // -> Returns 'true' if 'variable' is of type 'Map',
  export function isMap(variable: any)
  {
    if (variable === null || variable === undefined || !variable.constructor)
      return false;

    return variable.constructor.name === 'Map';
  }

  // Detects only native javascript Objects - not classes.
  // -> Returns 'true' if 'variable' is of type 'Object',
  export function isPlainObject(variable: any)
  {
    if (variable === null || variable === undefined || !variable.constructor)
      return false;

    return variable.constructor.name === 'Object';
  }

  // Detects native javascript Arrays.
  // -> Returns 'true' if 'variable' is of type 'Array',
  export function isArray(variable: any)
  {
    if (variable === null || variable === undefined || !variable.constructor)
      return false;

    return variable.constructor.name === 'Array';
  }

  // -> Returns 'true' if 'variable' is a primitive type
  //    (boolean, null, undefined, number, string or symbol).
  export function isPrimitiveType(variable: any)
  {
    // For some reason typeof 'null' is 'object' in javascript
    // so we have check for it explicitely.
    return variable === null || typeof variable !== 'object';
  }

  // -> Returns 'true' if 'variable' is of type 'Set'.
  export function isSet(variable: any)
  {
    if (variable === null || variable === undefined || !variable.constructor)
      return false;

    return variable.constructor.name === 'Set';
  }

  export function isSerializable(variable: any)
  {
    return variable instanceof Serializable;
  }

  // -> Returns 'true' if 'variable' is a number.
  export function isNumber(variable: any)
  {
    return typeof variable === 'number';
  }
}