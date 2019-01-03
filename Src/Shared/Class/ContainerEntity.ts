/*
  Part of Kosmud

  An entity that can contain other entities and be contained in
  another container entity.
*/

import { Entity } from "../../Shared/Class/Entity";

export const CONTENTS = "contents";

export class ContainerEntity<T extends ContainerEntity<T>> extends Entity
{
  private container: ContainerEntity<T> | "Not in container" =
    "Not in container";

  // Every GameEntity can contain other game entities.
  private readonly contents = new Set<T>();

  // --------------- Public methods ---------------------

  public has(entity: T)
  {
    return this.contents.has(entity);
  }

  public isInContainer()
  {
    return this.container !== "Not in container";
  }

  // ! Throws exception on error.
  public getContainer()
  {
    if (this.container === "Not in container")
    {
      throw Error(`Failed to get container of ${this.debugId}`
        + ` because this entity is not in any container`);
    }

    return this.container;
  }

  // --------------- Protected methods ------------------

  protected getContents()
  {
    return this.contents;
  }

  // ! Throws exception on error.
  protected insert(entity: T)
  {
    if (this.has(entity))
    {
      throw Error(`Entity ${this.debugId} already contains`
        + ` ${entity.debugId}`);
    }

    this.contents.add(entity);
    entity.container = this;
  }

  // ! Throws exception on error.
  protected remove(entity: T)
  {
    const hadEntity = this.contents.delete(entity);

    if (!hadEntity)
    {
      throw Error(`Entity ${entity.debugId} isn't inside`
        + ` ${this.debugId} so it can't be removed from there`);
    }

    entity.container = "Not in container";
  }
}