/*
  Part of Kosmud

  Various utility functions.
*/

import { Types } from "Shared/Utils/Types";

export namespace Utils
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

    for (const propertyName in defaults)
    {
      if (defaults.hasOwnProperty(propertyName))
      {
        const sourceProperty = defaults[propertyName];
        const targetProperty = target[propertyName];

        if (!defaults.hasOwnProperty(propertyName))
          continue;

        if (sourceProperty === undefined)
          continue;

        if (targetProperty === undefined)
        {
          target[propertyName] = sourceProperty;
          continue;
        }

        const sourceIsPlainObject = Types.isPlainObject(sourceProperty);
        const targetIsPlainObject = Types.isPlainObject(targetProperty);

        if (sourceIsPlainObject && targetIsPlainObject)
        {
          applyDefaults(targetProperty, sourceProperty);
        }
      }
    }

    return target;
  }

  // Note: If you get a compiler error "Argument of type '"xy"'
  //   is not assignable to parameter of type 'never'",
  //   it means that there is a case missing in the switch.
  export function reportMissingCase(variable: never)
  {
    return new Error("Unhandled switch case");
  }
}