/*  Part of Kosmud  */

import { Entity } from "../../Shared/Class/Entity";
import { Entities } from "../../Shared/Class/Entities";
import { PacketHandler } from "../../Shared/Net/PacketHandler";
import { Serializable } from "../../Shared/Class/Serializable";

const ENTITIES = "entities";

export class Packet extends Serializable
{
  private readonly entities = new Set<Entity>();

  // ---------------- Public methods --------------------

  public async process(connection: PacketHandler): Promise<void>
  {
    // Packet.process isn't abstract, because than it would be necessary
    // to implement both server-side and client-side version of all packet
    // classes even though they are only processed on one side.
    //  (Perfectly clean solution would require multiple inheritance so we
    // don't use it.)
    throw Error("This method needs to be overriden in descendant class");
  }

  // ! Throws exception on error.
  protected addEntity<T extends Entity>(entity: T): T
  {
    if (this.entities.has(entity))
      throw Error(`Packet ${this.debugId} already has ${entity.debugId}`);

    this.entities.add(entity);

    return entity;
  }

  // -------------- Protected methods -------------------

  // ~ Overrides Serializable.customSerializeProperty.
  // Serialize all entities from packet's 'entities' property when
  // the packet is serialized.
  protected customSerializeProperty(param: Serializable.SerializeParam): any
  {
    if (!isProtocolMode(param.mode))
      return "Property isn't serialized customly";

    if (param.property === this.entities)
      return this.serializeEntities(param.property, param.mode);

    return "Property isn't serialized customly";
  }

  // ! Throws exception on error.
  // ~ Overrides Serializable.customDeserializeProperty.
  // Deserialize all entities from packet's 'entities' property when
  // the packet is deserialized.
  protected customDeserializeProperty(param: Serializable.DeserializeParam)
  {
    if (param.propertyName === ENTITIES)
      // ! Throws exception on error.
      return this.deserializeEntities(param.sourceProperty);

    return "Property isn't deserialized customly";
  }

  // ---------------- Private methods -------------------

  private serializeEntities(entities: Set<Entity>, mode: Serializable.Mode)
  {
    const serializedEntities = new Array<object>();

    for (const entity of entities)
      serializedEntities.push(entity.saveToJsonObject(mode));

    return serializedEntities;
  }

  // ! Throws exception on error.
  private deserializeEntities(sourceProperty: any)
  {
    const entites = new Set();

    for (const jsonObject of sourceProperty)
    {
      // ! Throws exception on error.
      const entity = Entities.loadEntityFromJsonObject(jsonObject);

      entites.add(entity);
    }

    return entites;
  }
}

// ----------------- Auxiliary Functions ---------------------

function isProtocolMode(mode: Serializable.Mode)
{
  return mode === "Send to client"
      || mode === "Send to server"
      || mode === "Send to editor";
}