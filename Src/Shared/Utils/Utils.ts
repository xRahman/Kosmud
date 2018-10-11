/*
  Part of Kosmud

  Various utility functions.
*/

import {Types} from '../../Shared/Utils/Types';

export module Utils
{
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
  // Example:
  //   switch (type)
  //   {
  //     case "Blue":
  //       doSomething();
  //       break;
  //
  //     default:
  //       // Typescript will show intelisense error here saying:
  //       //   "Argument of type '"Red"' is not
  //       //    assignable to parameter of type 'never'" because
  //       //  you forgot to handle "Red" case.
  //       Utils.reportMissingCase(type);
  //   }
  export function reportMissingCase(variable: never)
  {
    throw new Error("Unhandled switch case");
  }
}