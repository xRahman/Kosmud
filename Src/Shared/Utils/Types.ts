/*
  Part of Kosmud

  Types and associated utility functions.
*/

import { Vector } from "../../Shared/Physics/Vector";
import { Serializable } from "../../Shared/Class/Serializable";

// Use 'isomorphic-ws' to use the same code on both client and server.
import * as WebSocket from "isomorphic-ws";

export namespace Types
{
  // Used for example in 'new Promise((resolve, reject) => { ... })'.
  export type ResolveFunction<T> = (value?: T | PromiseLike<T>) => void;

  // Used for example in 'new Promise((resolve, reject) => { ... })'.
  export type RejectFunction = (reason?: any) => void;

  export type OpenEvent =
  {
    target: WebSocket;
  };

  export type OpenEventHandler = (event: OpenEvent) => void;

  export type MessageEvent =
  {
    data: WebSocket.Data;
    type: string;
    target: WebSocket;
  };

  export type MessageEventHandler = (event: MessageEvent) => void;

  export type ErrorEvent =
  {
    error: any;
    message: string;
    type: string;
    target: WebSocket;
  };

  export type ErrorEventHandler = (event: ErrorEvent) => void;

  export type CloseEvent =
  {
    wasClean:
    boolean;
    code: number;
    reason: string;
    target: WebSocket;
  };

  export type CloseEventHandler = (event: CloseEvent) => void;

  // If you exclaim "WTF!" loudly after reading the next two lines of
  // code, I absolutely aggree with you.
  //   The point of this gibberish is to declare a type that describes
  // any class (like Serializable) so you can call something like
  // dynamicCast(Serializable). Regular classes in typescript are
  // considered to be a constructor function, hence the 'new(...args): T'
  // part on the right of '|' character. However, some classes can be
  // abstract and in that case they don't have a constructor function
  // because the whole point of an abstract class is that it cannot be
  // instantiated. So the type of an abstract class is a Function with
  // a prototype with no constructor.
  //   TLDR: this type describes both abstract and nonabstract classes.
  export type AnyClass<T> =
    (Function & { prototype: T }) | { new (...args: any[]): T };

  // Nonabstract class in javascript is it's constructor function.
  export type NonabstractClass<T> = { new (...args: any[]): T };

  export function isString(variable: any): boolean
  {
    return typeof variable === "string";
  }

  export function isBitvector(variable: any)
  {
    if (variable === null || variable === undefined || !variable.constructor)
      return false;

    return variable.constructor.name === "FastBitSet";
  }

  export function isVector(variable: any)
  {
    return variable instanceof Vector;
  }

  export function isDate(variable: any)
  {
    if (variable === null || variable === undefined || !variable.constructor)
      return false;

    return variable.constructor.name === "Date";
  }

  export function isMap(variable: any)
  {
    if (variable === null || variable === undefined || !variable.constructor)
      return false;

    return variable.constructor.name === "Map";
  }

  // Detects only native javascript Objects - not classes.
  export function isPlainObject(variable: any)
  {
    if (variable === null || variable === undefined || !variable.constructor)
      return false;

    return variable.constructor.name === "Object";
  }

  export function isArray(variable: any)
  {
    if (variable === null || variable === undefined || !variable.constructor)
      return false;

    return variable.constructor.name === "Array";
  }

  // -> Returns 'true' if 'variable' is a primitive type
  //    (boolean, null, undefined, number, string or symbol).
  export function isPrimitiveType(variable: any)
  {
    // For some reason typeof 'null' is 'object' in javascript
    // so we have check for it explicitely.
    return variable === null || typeof variable !== "object";
  }

  export function isSet(variable: any)
  {
    if (variable === null || variable === undefined || !variable.constructor)
      return false;

    return variable.constructor.name === "Set";
  }

  export function isSerializable(variable: any)
  {
    return variable instanceof Serializable;
  }

  export function isNumber(variable: any)
  {
    return typeof variable === "number";
  }

  // ! Throws exception on error.
  export function dynamicCast<T>(instance: unknown, Class: AnyClass<T>): T
  {
    if (!(instance instanceof Class))
    {
      throw Error (`Variable is not an instance of class (${Class.name})`);
    }

    return instance as T;
  }
}