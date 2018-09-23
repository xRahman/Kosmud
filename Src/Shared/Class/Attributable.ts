/*
  Part of Kosmud

  Enables using static attributes of class methods and data variables.
*/

/*
  Static property attributes are created by declaring static property of the
  same name and assigning an object containing required attributes to it.

  Example:

  class MyClass
  {
    // A variable we want to set attributes for.
    protected counter = 0;
      // Static attributes of variable 'counter'.
      protected static counter: PropertyAttributes =
      {
        saved: false
      };
  }
*/

'use strict';

import {Attributes} from '../../Shared/Class/Attributes';

///export class Attributable extends Nameable
export class Attributable
{
  // Default values of property attributes
  // (this is are inherited by descendants and can be overriden).
  protected static defaultAttributes: Attributes =
  {
    saved: true,
    edited: true,
    sentToClient: true,
    sentToServer: true
  };

  // ---------------- Public methods --------------------

  // In Javascript, 'name' of the constructor is the class name.
  public getClassName() { return this.constructor.name; }

  // -------------- Protected methods -------------------

  // -> Returns object containing static attributes for a given class property,
  //    Returns 'undefined' if 'property' doesn't have static attributes.
  // (Note that 'defaultAttributes' declare in the same class as the property
  //  are taken in effect, not possible override in a descendant class.)
  protected getAttributes(propertyName: string): Attributes
  {
    // Traverse prototype tree to find 'thi's on which
    // property 'propertyName' is 'own' property.
    ///let propertyThis = this.getPropertyThis(propertyName);
    let attributes: Attributes;
    // Use default attributes declared at the same object as property.
    ///let defaultAttributes = propertyThis.constructor['defaultAttributes'];
    let defaultAttributes = (this.constructor as any)['defaultAttributes'];
    // These are attributes declared as a static property with the same
    // name as non-static property.
    let propertyAttributes = (this.constructor as any)[propertyName];

    // This trick will 'copy' all properties from 'propertyAttributes'
    // to a new object by creating a new {} and setting 'propertyAttributes'
    // as it's prototype object.
    if (propertyAttributes)
      attributes = Object.create(propertyAttributes);
    else
      attributes = {};

    // Add default value for attributes that don't exist in
    // 'propertyAttributes'.
    for (let attribute in defaultAttributes)
    {
      if (!propertyAttributes || propertyAttributes[attribute] === undefined)
        (attributes as any)[attribute] = defaultAttributes[attribute];
    }

    // Do one more defaulting - against 'defaltAttributes' declared
    // here in Attributable class. This way 'defaultAttributes' on
    // descendatns don't have to list all existing attributes.
    for (let attribute in Attributable.defaultAttributes)
    {
      if (!attributes || (attributes as any)[attribute] === undefined)
      {
        (attributes as any)[attribute] =
          (Attributable.defaultAttributes as any)[attribute];
      }
    }

    return attributes;
  }

  // --------------- Private methods --------------------
}
