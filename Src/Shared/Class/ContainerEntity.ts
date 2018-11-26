/*
  Part of Kosmud

  GameEntity class ancestor.
*/

import { Entity } from "../../Shared/Class/Entity";

export class ContainerEntity extends Entity
{
  // Every GameEntity can contain other game entities.
  private readonly contents = new Map<string, ContainerEntity>();

  // --------------- Public methods ---------------------

  public has(entity: ContainerEntity)
  {
    return this.contents.has(entity.getId());
  }

  // --------------- Protected methods ------------------

  protected get(id: string): ContainerEntity | "Not found"
  {
    const entity = this.contents.get(id);

    if (entity === undefined)
      return "Not found";

    return entity;
  }

  protected getContents()
  {
    return this.contents.values();
  }

  // ! Throws exception on error.
  protected addToContents(entity: ContainerEntity)
  {
    if (this.has(entity))
    {
      throw new Error(`Entity ${this.debugId} already contains`
        + ` ${entity.debugId}`);
    }

    this.contents.set(entity.getId(), entity);
  }

  // ! Throws exception on error.
  protected remove(entity: ContainerEntity)
  {
    const hadEntity = this.contents.delete(entity.getId());

    if (!hadEntity)
    {
      throw new Error(`Entity ${entity.debugId} isn't inside`
        + ` ${this.debugId} so it can't be removed from there`);
    }
  }
}