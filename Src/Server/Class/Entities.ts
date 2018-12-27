/*
  Part of Kosmud

  Server-side functionality of static class that stores all entities.
*/

import { JsonObject } from "../../Shared/Class/JsonObject";
import { timeOfBoot } from "../../Server/KosmudServer";
import { PROTOTYPE_ID } from "../../Shared/Class/Entity";
import * as Shared from "../../Shared/Class/Entities";

export class Entities extends Shared.Entities
{
  // Counter of issued ids in this boot.
  private static lastIssuedId = 0;

  // ------------- Public static methods ----------------

  // ! Throws exception on error.
  public static newEntity
  (
    // Either an entity id or a class name if you are instantiating
    // direcly from a hardcoded entity class.
    prototypeId: string
  )
  {
    const prototype = Entities.get(prototypeId);

    // ! Throws exception on error.
    return Entities.instantiateEntity(prototype, this.generateId());
  }

  // ! Throws exception on error.
  public static loadEntityFromJsonData(entityId: string, jsonData: string)
  {
    // const jsonObject = Serializable.deserialize(jsonData);
    const jsonObject = JsonObject.parse(jsonData);
    const prototypeId = getPrototypeIdFromJsonObject(jsonObject);
    // ! Throws exception on error.
    const prototype = Entities.get(prototypeId);
    const entity = Entities.instantiateEntity(prototype, entityId);

    return entity.deserialize(jsonObject);
  }

  // ------------- Private static methods ---------------

  private static generateId()
  {
    // Increment lastIssuedId first so we start with 1 (initial value is 0).
    this.lastIssuedId++;

    // String id consists of radix-36 representation of lastIssuedId
    // and a radix-36 representation of current boot timestamp
    // (in miliseconds from the start of computer age) separated by dash ('-').
    // (radix 36 is used because it's a maximum radix toString() allows to use
    // and thus it leads to the shortest possible string representation of id)
    const idCounter = this.lastIssuedId.toString(36);
    const bootTime = timeOfBoot.getTime().toString(36);

    return `${idCounter}-${bootTime}`;
  }
}

// ----------------- Auxiliary Functions ---------------------

// ! Throws exception on error.
function getPrototypeIdFromJsonObject(jsonData: object)
{
  const prototypeId = (jsonData as any)[PROTOTYPE_ID];

  if (!prototypeId)
  {
    throw new Error(`Missing or invalid ${PROTOTYPE_ID} in entity json data`);
  }

  return prototypeId;
}