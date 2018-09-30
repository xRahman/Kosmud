/*
  Part of Kosmud

  Static class that stores all entities.
*/

import {Entity} from '../../Shared/Class/Entity';

export class Entities
{
  /// Zatím provizorně.
  private entities: Array<Entity> = [];

  // ------------- Public static methods ----------------

  public getReference(id: string)
  {
    /// Zatím provizorně.
    return new Entity();
  }
}
