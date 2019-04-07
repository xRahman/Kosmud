/*  Part of Kosmud  */

import { Types } from "../../Shared/Utils/Types";
import { ID, PROTOTYPE_ID } from "../../Shared/Class/Serializable";
import { Entity } from "../../Shared/Class/Entity";
import { ClassFactory } from "../../Shared/Class/ClassFactory";

// Use a static class because we need to inherit from it
// (new entities are only created on the server) which
// cannot be done using namespaces split to different files.
// tslint:disable-next-line:no-unnecessary-class
export class Entities
{
  // Key:   Entity id.
  // Value: Entity instance.
  private static readonly entities = new Map<string, Entity>();

  // ! Throws exception on error.
  public static get(id: string)
  {
    const entity = this.entities.get(id);

    if (entity === undefined)
    {
      throw Error(`Entity with id '${id}' is not in Entities`);
    }

    return entity;
  }

  // -> Returns respective entity if it exists in Entities,
  ///   invalid entity otherwise.
  public static getReference(id: string)
  {
    const entity = this.entities.get(id);

    if (entity === undefined)
      return createInvalidEntity(id);

    return entity;
  }

  public static has(id: string)
  {
    return this.entities.has(id);
  }

  // ! Throws exception on error.
  public static remove(entity: Entity)
  {
    if (!this.entities.delete(entity.getId()))
    {
      throw Error(`Failed to remove entity with id '${entity.getId()}'`
        + ` from Entities because it's not there`);
    }

    // Recursively delete all properties and set the prototype to 'null'.
    // This way if anyone has a reference to this entity and tries to use
    // it, an exception will be thrown (so we will know that someone tries
    // to use a deleted entity).
    //   From this time on, entity.isValid() will also return 'false'.
    entity.invalidate();
  }

  // ! Throws exception on error.
  public static createRootPrototypeEntity<T extends Entity>
  (
    Class: Types.NonabstractClass<T>
  )
  {
    const prototype = new Class();

    prototype.setId(Class.name);

    // ! Throws exception on error.
    return this.instantiateEntity(prototype, Class.name);
  }

  // ! Throws exception on error.
  public static loadEntityFromJsonObject
  (
    jsonObject: object,
    expectedId?: string
  )
  {
    // ! Throws exception on error.
    const id = readId(jsonObject, ID);

    if (expectedId !== undefined && expectedId !== id)
    {
      throw Error(`Failed to load entity from json object because`
        + ` contained id ${id} differs expected id ${expectedId} (which`
        + ` is part of the name of file where the entity is saved)`);
    }

    // ! Throws exception on error.
    const prototypeId = readId(jsonObject, PROTOTYPE_ID);
    // ! Throws exception on error.
    const prototype = this.get(prototypeId);
    const entity = this.instantiateEntity(prototype, id);

    return entity.deserialize(jsonObject);
  }

  // ------------ Protected static methods --------------

  // ! Throws exception on error.
  protected static instantiateEntity(prototype: Entity, id: string)
  {
    // if (this.entities.has(id))
    // {
    //   throw Error(`Failed to instantiate entity because entity`
    //     + ` with id '${id}' already exists in Entities`);
    // }

    const existingEntity = this.entities.get(id);

    // Change: Allow overwritting of existing entities.
    if (existingEntity)
      return existingEntity;

    const entity = ClassFactory.instantiate(prototype);

    entity.setId(id);
    entity.setPrototypeId(prototype.getId());

    this.entities.set(id, entity);

    entity.onInstantiation();

    return entity;
  }
}

// ----------------- Auxiliary Functions ---------------------

function createInvalidEntity(id: string)
{
  const invalidEntity =
  {
    getId: () => { return id; },
    isValid: () => { return false; },
    debugId: `{ Invalid entity reference, id: ${id} }`
  };

  return invalidEntity;
}

// ! Throws exception on error.
function readId(jsonData: object, propertyName: string)
{
  const id = (jsonData as any)[propertyName];

  if (!id)
  {
    throw Error(`Missing or invalid ${propertyName} in entity json data`);
  }

  return id;
}