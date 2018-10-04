/*
  Part of Kosmud

  Various utility functions.
*/

import { Types } from './Types';

export module Utils
{
  export function isColorCode(code: string): boolean
  {
    switch (code)
    {
      case '&n':
      case '&d':
      case '&i':
      case '&u':
      case '&l':
      case '&k':
      case '&Ki':
      case '&K':
      case '&r':
      case '&Ri':
      case '&R':
      case '&g':
      case '&Gi':
      case '&G':
      case '&y':
      case '&Y':
      case '&b':
      case '&Bi':
      case '&B':
      case '&m':
      case '&M':
      case '&c':
      case '&C':
      case '&w':
      case '&W':
        return true;        
    }

    return false;
  }

  // Copies properties of 'defaults' object to 'target' object
  // if they are not present in it. This is even done recursively
  // so you can default only some sub-properties.
  // (Generic type is used to ensure that 'defaults' parameter is
  //  of the same type as 'target' parameter).
  // -> Returns modified 'target'.
  export function applyDefaults<T>(target: T, defaults: T)
  {
    if (!defaults)
      return target;

    for (let propertyName in defaults)
    {
      let sourceProperty = defaults[propertyName];
      let targetProperty = target[propertyName]

      if (!defaults.hasOwnProperty(propertyName))
        continue;

      if (sourceProperty === undefined)
        continue;

      if (targetProperty === undefined)
      {
        target[propertyName] = sourceProperty;
        continue;
      }

      // If both properties are plain objects, call applyDefaults()
      // recursively on them.
      if
      (
        Types.isPlainObject(sourceProperty)
        && Types.isPlainObject(targetProperty)
      )
      {
        applyDefaults(targetProperty, sourceProperty);
      }
    }

    return target;
  }

  // ! Throws exception on error.
  // This function is used to enforce that all switch cases are handled
  // when using compound type of switch argument.
  //
  //   Example:
  //     iport {Utils} from '../Shared/Utils';
  //
  //     type Type = "Blue" | "Red";
  //
  //     function something(type: Type)
  //     {
  //       switch (type)
  //       {
  //         case "Blue":
  //           doSomething();
  //           break;
  //
  //         default:
  //           // Typescript will show intelisense error here saying:
  //           //   "Argument of type '"Red"' is not
  //           //    assignable to parameter of type 'never'" because
  //           //  you forgot to handle "Red" case.
  //           Utils.reportMissingCase(type);
  //       }
  //     }
  export function reportMissingCase(variable: never)
  {
    throw new Error("Unhandled switch case");
  }
}