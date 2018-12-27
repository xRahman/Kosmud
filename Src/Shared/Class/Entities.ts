/*
  Part of Kosmud

  Static class that stores all entities.
*/

import { Types } from "../../Shared/Utils/Types";
import { Entity } from "../../Shared/Class/Entity";
import { ClassFactory } from "../../Shared/Class/ClassFactory";

// Use a static class because we need to inherit from it (because
// new entities are only created on the server) which cannot be done
// using namespaces split to different files.
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

  public static has(id: string)
  {
    return this.entities.has(id);
  }

  // ! Throws exception on error.
  public static remove(entity: Entity)
  {
    if (!this.entities.delete(entity.getId()))
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
  protected static instantiateEntity(prototype: Entity, id: string)
  {
    if (this.entities.has(id))
    {
      throw new Error(`Failed to instantiate entity because entity`
        + ` with id '${id}' already exists in Entities`);
    }

    const entity = ClassFactory.instantiate(prototype);

    entity.setId(id);
    entity.setPrototypeId(prototype.getId());

    this.entities.set(id, entity);

    return entity;
  }
}