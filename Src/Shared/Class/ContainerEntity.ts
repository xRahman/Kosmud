/*
  Part of Kosmud

  GameEntity class ancestor.
*/

import { Entity } from "../../Shared/Class/Entity";

export class ContainerEntity extends Entity
{
  private container: ContainerEntity | "Not in container" = "Not in container";

  // Every GameEntity can contain other game entities.
  private readonly contents = new Map<string, ContainerEntity>();

  // --------------- Public methods ---------------------

  public has(entity: ContainerEntity)
  {
    return this.contents.has(entity.getId());
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
      throw new Error(`Failed to get container of ${this.debugId}`
        + ` because this entity is not in any container`);
    }

    return this.container;
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
  protected insert(entity: ContainerEntity)
  {
    if (this.has(entity))
    {
      throw new Error(`Entity ${this.debugId} already contains`
        + ` ${entity.debugId}`);
    }

    this.contents.set(entity.getId(), entity);
    entity.container = this;
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

    entity.container = "Not in container";
  }
}