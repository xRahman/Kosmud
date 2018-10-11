/*
  Part of Kosmud

  Static class that stores all entities.
*/

import {Classes} from '../../Shared/Class/Classes';
import {Entity} from '../../Shared/Class/Entity';

export class Entities
{
  private static entities = Classes.entities = new Entities();

  /// Zatím provizorně.
  private entities: Array<Entity> = [];

  // ------------- Public static methods ----------------

  public getReference(id: string)
  {
    /// Zatím provizorně.
    return new Entity();
  }
}
