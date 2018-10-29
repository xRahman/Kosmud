/*
  Part of Kosmud

  Enables using static attributes of class methods and variables.
*/

/*
  Static property attributes are created by declaring static property of the
  same name and assigning an 'Attributes' object to it.

  Example:

  class MyClass
  {
    // A variable we want to set attributes for.
    protected counter = 0;
      // Static attributes of variable 'counter'.
      protected static counter: Attributes =
      {
        saved: false
      };
  }
*/

import { applyDefaults } from "../../Shared/Utils/Object";
import { Attributes, DEFAULT_ATTRIBUTES } from "../../Shared/Class/Attributes";

const DEFAULT_ATTRIBUTES_PROPERTY = "defaultAttributes";

export class Attributable
{
  protected static defaultAttributes: Attributes = DEFAULT_ATTRIBUTES;

  // --------------- Public methods ---------------------

  // In Javascript, 'name' of the constructor is the class name.
  public getClassName() { return this.constructor.name; }

  // -------------- Protected methods -------------------

  // -> Returns object containing static attributes for a given class property,
  //    Returns 'undefined' if 'property' doesn't have static attributes.
  // (Note that 'defaultAttributes' declared in the same class as the property
  //  are taken in effect, not possible override in a descendant class.)
  protected propertyAttributes(propertyName: string): Attributes
  {
    // If an Attributable class has a static property 'defaultValues', it
    // will serve as default values of attributes of all class properties.
    const classDefaultAttributes =
      (this.constructor as any)[DEFAULT_ATTRIBUTES_PROPERTY];

    // Any property of Attributable class can have specific attributes.
    // They are declared as a static class property with the same name.
    const propertySpecificAttributes = (this.constructor as any)[propertyName];

    let attributes = {};
    const globalDefaultAttibutes = Attributable.defaultAttributes;

    attributes = applyDefaults(attributes, propertySpecificAttributes);
    attributes = applyDefaults(attributes, classDefaultAttributes);
    attributes = applyDefaults(attributes, globalDefaultAttibutes);

    return attributes;
  }
}
