/*
  Part of Kosmud

  Static class that stores all entities.
*/

import { ClassFactory } from "../../Shared/Class/ClassFactory";
import { Entity } from "../../Shared/Class/Entity";

export class Entities
{
  // Note that we also inicialize 'ClassFactory.entities' here.
  // (It's used to circumvent cyclic module dependancy
  // when importing Entities from Serializable.)
  private static readonly entities = ClassFactory.entities = new Entities();

  /// Zatím provizorně.
  private readonly entities: Array<Entity> = [];

  // ------------- Public static methods ----------------

  // tslint:disable-next-line:prefer-function-over-method
  public getReference(id: string)
  {
    /// Zatím provizorně.
    return new Entity();
  }
}
