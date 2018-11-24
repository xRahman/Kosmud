/*
  Part of Kosmud

  Entity is an Object that:
  - has a unique id
  - can be serialized and deserialized
  - can be inherited from another entity using
    true prototypal inheritance

  True prototypal inheritance means that an instance
  is created using Object.create() so it is just an
  empty {} with no own properties and that all it's
  nonprimitive properties are also instantiated using
  Obect.create() against the matching property on the
  prototype entity.
    This way all properties inicialized on prototype
  entity by it's constructor or direct inicialization
  in class body in typescript class will actually be
  set to prototype object, not the instance. Properties
  set to the instance will also never modify the prototype
  (unlinke in javascript prototypal inheritance where
  nonprimitive properties of the instance are references
  to the matching properties on the prototype so writing
  to them actually modifies the prototype object instead
  of creating own propety on the instance).
*/

import { ID, Serializable } from "../../Shared/Class/Serializable";

export class Entity extends Serializable
{
  private id = "Not assigned";
  private name = "<missing name>";

  // --------------- Public methods ---------------------

  // ~ Overrides Serializable.get debugId().
  public get debugId()
  {
    let id: string;
    // Access 'this.id' directly (not using this.getId()) because
    // it would trigger another ERROR() which would precede logging
    // of the ERROR when getErrorIdString() is called. That would
    // give confusing information about the actual error.

    if (this.id === undefined)
    {
      id = "undefined";
    }
    else if (this.id === null)
    {
      id = "null";
    }
    else
    {
      id = this.id;
    }

    return `{ className: ${this.getClassName()},`
      + ` name: ${this.name}, id: ${id} }`;
  }

  // ! Throws exception on error.
  public getId()
  {
    const hasOwnValidId = this.hasOwnProperty(ID)
      && this.id !== "Not assigned"
      && this.id !== undefined
      && this.id !== null
      && this.id !== "";

    // If we don't have own 'id' property, this.id would return
    // id of our prototype object (thanks to inheritance), which
    // is not our id (id has to be unique for each entity instance).
    if (!hasOwnValidId)
    {
      throw new Error(`Attempt to get ${ID} of an entity which`
        + ` doesn't have an ${ID}. This must never happen, each`
        + ` entity must have a valid ${ID}"`);
    }

    return this.id;
  }

  // ! Throws exception on error.
  public setId(id: string)
  {
    // Id can only be set once.
    //   We need to check if we have own property 'id'
    // (not just the one inherited from our prototype),
    // because if we don't, value of 'this.id' would be
    // that of our prototype.
    if (this.hasOwnProperty(ID) && this.id !== "Not assigned")
    {
      throw new Error(`Failed to set ${ID} of entity ${this.debugId}`
        + ` because it already has an ${ID}`);
    }

    this.id = id;

    if (!this.hasOwnProperty(ID))
    {
      throw new Error(`Something is terribly broken - property`
        + `'${ID}' has been set to prototype object rather than`
        + `to the instance`);
    }
  }

  public getName() { return this.name; }
  public setName(name: string) { this.name = name; }

  // -------------- Protected methods -------------------

  // --------------- Private methods --------------------
}
