/*
  Part of Kosmud

  Server-side functionality of static class that stores all entities.
*/

import { Types } from "../../Shared/Utils/Types";
import { FileSystem } from "../../Server/FileSystem/FileSystem";
import { JsonObject } from "../../Shared/Class/JsonObject";
import { timeOfBoot } from "../../Server/KosmudServer";
import { ID, PROTOTYPE_ID } from "../../Shared/Class/Serializable";
// import { Entity } from "../../Shared/Class/Entity";
import * as Shared from "../../Shared/Class/Entities";

export class Entities extends Shared.Entities
{
  // Counter of issued ids in this boot.
  private static lastIssuedId = 0;

  // ------------- Public static methods ----------------

  // ! Throws exception on error.
  public static newRootEntity<T>(Class: Types.NonabstractClass<T>): T
  {
    // ! Throws exception on error.
    return this.newEntity(Class.name).dynamicCast(Class);
  }

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
  public static async loadEntity(directory: string, id: string)
  {
    const fileName = Entities.getFileName(id);
    // ! Throws exception on error.
    const json = await FileSystem.loadJsonFromFile(directory, fileName);

    // ! Throws exception on error.
    return this.loadEntityFromJson(json, id);
  }

  public static getFileName(id: string)
  {
    return `${id}.json`;
  }

  public static loadEntityFromJsonObject
  (
    jsonObject: object,
    expectedId?: string
  )
  {
    const id = readId(jsonObject, ID);

    if (expectedId !== undefined && expectedId !== id)
    {
      throw new Error(`Failed to load entity from json object because`
        + ` contained id ${id} differs expected id ${expectedId} (which`
        + ` is part of the name of file where the entity is saved)`);
    }

    const prototypeId = readId(jsonObject, PROTOTYPE_ID);
    // ! Throws exception on error.
    const prototype = this.get(prototypeId);
    const entity = this.instantiateEntity(prototype, id);

    return entity.deserialize(jsonObject);
  }

  // ------------- Private static methods ---------------

  // ! Throws exception on error.
  private static loadEntityFromJson(json: string, expectedId: string)
  {
    // ! Throws exception on error.
    const jsonObject = JsonObject.parse(json);

    return this.loadEntityFromJsonObject(jsonObject, expectedId);
  }

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
function readId(jsonData: object, propertyName: string)
{
  const id = (jsonData as any)[propertyName];

  if (!id)
  {
    throw new Error(`Missing or invalid ${propertyName} in entity json data`);
  }

  return id;
}