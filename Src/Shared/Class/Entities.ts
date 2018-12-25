/*
  Part of Kosmud

  Static class that stores all entities.
*/

import { Types } from "../../Shared/Utils/Types";
import { Entity } from "../../Shared/Class/Entity";
import { ClassFactory } from "../../Shared/Class/ClassFactory";

// Key:   Entity id.
// Value: Entity instance.
const entities = new Map<string, Entity>();

// ! Throws exception on error.
export function get(id: string)
{
  const entity = entities.get(id);

  if (entity === undefined)
  {
    /// TODO: Prej mám vrátit "invalid entity reference"
    ///  (říká Serializable.readEntityReference()).
    /// - dává to možná smysl, protože když bude při loadování něco
    ///   cyklicky prolinkované, tak zaručeně nastane situace, kdy
    ///   referencovaná entita při loadingu ještě nebude loadnoutá.
    ///   (ale třeba cyklická provázanost nenastane, kdo ví...).
    /// Respektive možná spíš nechat metodu get() takhle a vrátit
    ///   getReference(), která to bude dělat.
    throw new Error(`Entity with id '${id}' is not in Entities`);
  }

  return entity;
}

export function has(id: string)
{
  return entities.has(id);
}

// ! Throws exception on error.
export function remove(entity: Entity)
{
  if (!entities.delete(entity.getId()))
  {
    throw new Error(`Failed to remove entity with id '${entity.getId()}'`
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
export function createRootPrototypeEntity<T extends Entity>
(
  Class: Types.NonabstractClass<T>
)
{
  const prototype = new Class();

  // ! Throws exception on error.
  return instantiateEntity(prototype, Class.name);
}

// ! Throws exception on error.
export function instantiateEntity(prototype: Entity, id: string)
{
  if (entities.has(id))
  {
    throw new Error(`Failed to instantiate entity because entity`
      + ` with id '${id}' already exists in Entities`);
  }

  const entity = ClassFactory.instantiate(prototype);

  entity.setId(id);

  entities.set(id, entity);

  return entity;
}