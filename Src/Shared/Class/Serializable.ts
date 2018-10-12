/*
  Part of Kosmud

  Allows serializing to and from JSON format.
*/

/*
  Notes:
    Only saved properties are loaded. Properties that are not
    present in the save will not be deleted. It means that you
    can add new properties to existing classes without converting
    existing save files (but you should initialize them with
    default values of course).

    Properties are loaded even if they don't exist in class
    into which we are loading. This allows saving of properties
    created in runtime.

    Serializing of entities using just an 'id' is implemented
    in Serializable rather than in Entity to allow serializable
    entity references in non-entity Serializable classes.

    Descendants can override methods customSerializeProperty()
    and customDeserializeProperty() to change how are specific
    properties serialized.
*/

/*
  Pozn.:
    Momentálně se static properties checkují jen pro přímé properties
    Serializable instance. Tj. když do entity dám plain {}, tak u jeho
    properties nemůžu říct, jestli se mají serializovat a jak se mají
    editovat. Můžu ale místo něj udělat classu zděděnou ze Serializable,
    u té to opět říct můžu.

    Když bych to chtěl změnit, tak by to asi znamenalo do SerializeParam
    přidat staticAttributes, do kterých se budu rekurzivně zanořovat.
    (A samozřejmě tuhle funkcionalitu přidat do Attributable class).
*/

import {Types} from '../../Shared/Utils/Types';
import {Utils} from '../Utils/Utils';
import {Classes} from '../../Shared/Class/Classes';
import {JsonObject} from '../../Shared/Class/JsonObject';
import {Attributable} from '../../Shared/Class/Attributable';

// 3rd party modules.
let FastBitSet = require('fastbitset');

const VERSION = 'version';
const CLASS_NAME = 'className';
const NAME = 'name';

// These are 'dummy' class names. They are only written to JSON
// but they don't really exists in code (Set and Map are build-in
// javascript classes, Bitvector translates to a 'fastbitset' object.
const BITVECTOR_CLASS_NAME = 'Bitvector';
const SET_CLASS_NAME = 'Set';
const MAP_CLASS_NAME = 'Map';
const REFERENCE_CLASS_NAME = 'Reference';

// These special property names are only written to serialized data
// (dor example 'map' property holds an Array that represents serialized
//  data of a Map object).
const BITVECTOR = 'bitvector';
const MAP = 'map';
const SET = 'set';
const ID = 'id';

export class Serializable extends Attributable
{
  // ---------------- Protected data --------------------

  // 'version' is used to convert data from older formats.
  //   You have to initialize it in the constructor
  // (otherwise you get an exception while serializing).
  protected version = 0;

  // ------------- Public static methods ----------------

  // ! Throws exception on error.
  // Use this only for Serializable objects not inherited from Entity.
  // TODO: Přidat comment, jak se loadují entity (nějak přes Entities)
  public static deserialize(data: string): Serializable
  {
    let jsonObject = JsonObject.parse(data);
    let className = (jsonObject as any)[CLASS_NAME];

    if (!className)
    {
      throw new Error("Unable to deserialize data because there is"
        + " no '" + CLASS_NAME + "' property in it");
    }

    let serializable = Classes.instantiateSerializableClass(className);

    return serializable.deserialize(jsonObject);
  }

  // ---------------- Public methods --------------------

  // ! Throws exception on error.
  public dynamicCast<T>(Class: Types.AnyClass<T>): T
  {
    // Dynamic type check - we make sure that entity is inherited
    // from requested class (or an instance of the class itself).
    if (!(this instanceof Class))
    {
      throw new Error ("Type cast error: serializable"
        + " object " + this.getErrorIdString() + " is"
        + " not an instance of class (" + Class.name + ")");
    }

    return <any>this;
  }

  // Returns string describing this object for error logging.
  public getErrorIdString()
  {
    // There is not much to say about generic serializable object.
    return "{ className: " + this.getClassName() + " }";
  }

  // ! Throws exception on error.
  public serialize(mode: Serializable.Mode): string
  {
    let jsonObject = this.saveToJsonObject(mode);

    if (!jsonObject)
      return "";

    return JsonObject.stringify(jsonObject);
  }

  // ! Throws exception on error.
  // Extracts data from plain javascript Object to this instance.
  // -> Returns 'null' on failure.
  public deserialize(jsonObject: Object, path?: string): Serializable
  {
    // ! Throws exeption if versions don't match.
    this.versionMatchCheck(jsonObject, path);

    // ! Throws exeption if class names in source and target data don't match.
    this.classMatchCheck(jsonObject, path);

    // Copy all properties from 'jsonObject'.
    for (let propertyName in jsonObject)
    {
      // Properties 'className' and 'version' aren't assigned
      // ('className' represents the name of the javascript class
      //   which cannot be changed and 'version' is serialized only
      //   to be checked agains).
      if (propertyName === CLASS_NAME || propertyName === VERSION)
        continue;

      // We are cycling over properties in JSON object, not in Serializable
      // that is being loaded. It means that properties that are not present
      // in the save will not get overwritten with 'undefined'. This allows
      // adding new properties to existing classes without the need to
      // convert all save files.
      (this as any)[propertyName] = this.deserializeProperty
      (
        {
          propertyName: propertyName,
          targetProperty: (this as any)[propertyName],
          sourceProperty: (jsonObject as any)[propertyName],
          path: path
        } 
      );
    }

    return this;
  }

  // -------------- Protected methods -------------------

  // This method can be overriden to change how is a certain
  // property serialized.
  // -> Returns 'undefined' if property is not customly serialized.
  protected customSerializeProperty(param: SerializeParam): any
  {
    return undefined;
  }

  // This method can be overriden to change how is a certain
  // property deserialized.
  // -> Returns 'undefined' if property is not customly deserialized.
  protected customDeserializeProperty(param: DeserializeParam)
  {
    return undefined;
  }

  // --------------- Private methods --------------------

  private writeName(jsonObject: Object)
  {
    if (this.hasOwnProperty(NAME))
      (jsonObject as any)[NAME] = (this as any)[NAME];

    return jsonObject;
  }

  private writeVersion(jsonObject: Object)
  {
    if (!this.hasOwnProperty(VERSION))
    {
      throw new Error("Failed to serialize " + this.getErrorIdString()
        + " because " + VERSION + " property is missing on it. Make"
        + " sure that '" + VERSION + "' is inicialized in the constructor");
    }

    let version = (this as any)[VERSION];

    if (!Types.isNumber(version))
    {
      throw new Error("Failed to serialize " + this.getErrorIdString()
        + " because " + VERSION + " property is not a number. Make"
        + " sure that '" + VERSION + "' is inicialized in the constructor"
        + " to some number");
    }

    (jsonObject as any)[VERSION] = version;

    return jsonObject;
  }

  private writeClassName(jsonObject: Object)
  {
    (jsonObject as any)[CLASS_NAME] = this.getClassName();

    return jsonObject;
  }

  // ! Throws exception on error.
  // Creates primitive Javascript Object and fills it with properties
  // of 'this'. Data types that can't be directly serialized to JSON
  // (like Set or Map) are converted to something serializable (Array,
  //  string, etc).
  private saveToJsonObject(mode: Serializable.Mode): Object
  {
    let jsonObject = {};

    // A little hack - save 'name', 'version' and 'className' properties
    // first (out of order) to make saved JSON files more readable.
    jsonObject = this.writeName(jsonObject);
    jsonObject = this.writeVersion(jsonObject);
    jsonObject = this.writeClassName(jsonObject);

    // Cycle through all properties in source object.
    for (let propertyName in this)
    {
      // Skip 'name', 'version' and 'className' properties because
      // they are already saved by hack.
      if (propertyName === NAME
          || propertyName === VERSION
          || propertyName === CLASS_NAME)
        continue;

      // Skip inherited properties (they are serialized on prototype entity).
      if (!this.hasOwnProperty(propertyName))
        continue;

      // Check if property is flagged to be serialized.
      if (!this.isSerialized(propertyName, mode))
        continue;
      
      // Skip nonprimitive properties that don't have any own properties.
      if (!this.hasOwnValue(this[propertyName]))
        continue;
 
      (jsonObject as any)[<string>propertyName] = this.serializeProperty
      (
        {
          property: this[propertyName],
          description: propertyName,
          className: this.getClassName(),
          mode: mode
        }
      );
    }

    return jsonObject;
  }

  // Determines if property 'propertyName' is to be serialized
  // in given serializable 'mode'.
  private isSerialized(propertyName: string, mode: Serializable.Mode)
  {
    let attributes = this.propertyAttributes(propertyName);

    // If static attributes for this property don't exist, it means
    // it should always be serialized.
    if (attributes === undefined)
      return true;

    switch (mode)
    {
      case 'Save to File':
        return attributes.saved !== false;

      case 'Send to Client':
        return attributes.sentToClient !== false;

      case 'Send to Server':
        return attributes.sentToServer !== false;

      case 'Send to Editor':
        return attributes.edited !== false;

      default:
        // Compiler error "Argument of type '"xy"' is not assignable to para-
        // meter of type 'never'" means there is a case missing in this switch.
        Utils.reportMissingCase(mode);
    }

    throw new Error("Unreachable code is executed. WTF?");
  }

  // ! Throws exception on error.
  // Writes a single property to a corresponding JSON object.
  // -> Returns JSON Object representing 'param.sourceProperty'. 
  private serializeProperty(param: SerializeParam): any
  {
    let property = param.property;
    let mode = param.mode;

    // Allow custom property serialization in descendants.
    let customValue = this.customSerializeProperty(param);
    if (customValue !== undefined)
      return customValue;

    // Primitive values (number, string, null, etc.) are just assigned.
    if (Types.isPrimitiveType(property))
      return property;

    if (Types.isArray(property))
      return this.serializeArray(param, property);

    // If there is an 'id' in the property, we treat it as Entity.
    if (property && property[ID])
      // Entities are serialized separately (each entity is saved to
      // a separate file). Only entity id will be saved.
      return this.createEntitySaver(property).saveToJsonObject(mode);

    // Property is a Serializable object (but not an entity).
    if (this.isSerializable(property))
      return property.saveToJsonObject(mode);

    if (Types.isDate(property))
    {
      throw new Error("Attempt to serialize property of type Date()."
        + " Date object should not be used because it can't be"
        + " properly inherited using prototypal inheritance."
        + " Use class Time instead. Property is not serialized");
    }

    if (Types.isMap(property))
      return this.createMapSaver(property).saveToJsonObject(mode);

    if (Types.isBitvector(property))
      return this.createBitvectorSaver(property).saveToJsonObject(mode);

    if (Types.isSet(property))
      return this.createSetSaver(property).saveToJsonObject(mode);

    if (Types.isPlainObject(property))
      return this.serializePlainObject(param);

    throw new Error("Property '" + param.description + "' in class"
      + " '" + param.className + "' (or inherited from one of it's"
      + " ancestors) is a class but is neither inherited from"
      + " Serializable nor has a type that we know how to save."
      + " Make sure that you only use primitive types (numbers,"
      + " strings, etc.), Arrays, primitive javascript Objects,"
      + " Maps or classes inherited from Serializable as properties"
      + " of classes inherited from Serializable. If you want a new"
      + " type to be saved, you need to add this functionality to "
      + " Serializable.ts. Property is not saved");
  }

  // Saves a property of type Array to a corresponding JSON Array object.
  private serializeArray(param: SerializeParam, sourceArray: Array<any>)
  {
    let jsonArray = [];

    // Serialize all items in source array and push them to 'jsonArray'.
    for (let i = 0; i < sourceArray.length; i++)
    {
      let serializedArrayItem = this.serializeProperty
      (
        {
          property: sourceArray[i],
          description: "Array item [" + i + "]",
          className: param.className,
          mode: param.mode
        }
      );

      jsonArray.push(serializedArrayItem);
    }

    return jsonArray;
  }

  // -> Returns 'true' if 'variable' has own (not just inherited) value.
  private hasOwnValue(variable: any): boolean
  {
    // Variables of primitive types are always serialized.
    if (Types.isPrimitiveType(variable))
      return true;

    if (Types.isMap(variable) || Types.isSet(variable))
    {
      // Maps and Sets are always instantiated as 'new Map()'
      // or 'new Set()'. We only serialize them if they contain
      // something.
      return variable.size !== 0;
    }

    // Other nonprimitive variables are only saved if they contain
    // any own (not inherited) properties which have some own (not
    // inherited) value themselves.
    for (let propertyName in variable)
    {
      if (!variable.hasOwnProperty(propertyName))
        continue;
      
      if (this.hasOwnValue(variable[propertyName]))
        return true;
    }

    return false;
  }

  // ! Throws exception on error.
  private serializePlainObject(param: SerializeParam): Object
  {
    let sourceObject = param.property;

    if (sourceObject === null)
    {
      throw new Error("Failed to serialize plain javascript obect"
        + " because source object is 'null'"); 
    }

    let jsonObject: Object = {};

    // Serialize all properties of sourceObject.
    for (let propertyName in sourceObject)
    {
      let sourceProperty = sourceObject[propertyName];

      // Skip nonprimitive properties that don't have any own properties.
      if (!this.hasOwnValue(sourceProperty))
        continue;

      (jsonObject as any)[propertyName] = this.serializeProperty
      (
        {
          property: sourceProperty,
          description: propertyName,
          className: 'Object',
          mode: param.mode
        }
      );
    }

    return jsonObject;
  }

  private isSerializable(variable: any): boolean
  {
    return ('serialize' in variable);
  }

  // ! Throws exception on error.
  // Deserializes a single property from corresponding JSON object.
  // Converts from serializable format to original data type as needed
  // (for example Set class is saved to JSON as an Array so it has to be
  //  reconstructed here).
  private deserializeProperty(param: DeserializeParam): any
  {
    let result: any;

    // Allow custom property deserialization in descendants.
    if ((result = this.customDeserializeProperty(param)) !== undefined)
      return result;

    // First handle the case that source property has 'null' value. In that
    // case target property will also be 'null', no matter what type it is.
    if (param.sourceProperty === null)
      return null;

    // Attempt to load property as FastBitSet object.
    if ((result = this.deserializeAsBitvector(param)) !== undefined)
      return result;

    // Attempt to load property as Set object.
    if ((result = this.deserializeAsSet(param)) !== undefined)
      return result;

    // Attempt to load property as Map object.
    if ((result = this.deserializeAsMap(param)) !== undefined)
      return result;

    // Attempt to load property as a reference to an Entity.
    if ((result = this.deserializeAsEntityReference(param)) !== undefined)
      return result;

    // Attempt to load property as Array
    if ((result = this.deserializeAsArray(param)) !== undefined)
      return result;

    // Attempt to load property as an object
    // (including custom classes).
    //   Note that this would also mean Arrrays and all other
    // nonprimitive types, so they must be handled before this.
    if ((result = this.deserializeAsObject(param)) !== undefined)
      return result;
    
    // If propety has neither of types we have just tried,
    // we load it as primitive type (primitive properties
    // are simply assigned).
    return param.sourceProperty;
  }

  // ! Throws exception on error.
  private classMatchCheck(jsonObject: Object, path?: string)
  {
    let sourceClassName = (jsonObject as any)[CLASS_NAME];
    let targetClassName = this.getClassName();

    if (sourceClassName === undefined)
    {
      throw new Error("Failed to deserialize because"
        + " there is no '" + CLASS_NAME + "' property"
        + " in JSON data" + this.composePathString(path));
    }

    if (sourceClassName !== targetClassName)
    {
      throw new Error("Failed to deserialize because"
        + " JSON data" + this.composePathString(path)
        + " belongs to class '" + sourceClassName + "'"
        + " while target class is '" + targetClassName + ")");
    }
  }

  // ! Throws exception on error.
  private versionMatchCheck(jsonObject: Object, path?: string)
  {
    let version = (jsonObject as any)[VERSION];

    // Note: '0' is a valid 'version'.
    if (version === undefined)
    {
      let pathString = this.composePathString(path);

      throw new Error("Failed to deserialize because"
        + " '" + VERSION + "' property is missing in JSON"
        + " data" + pathString);
    }

    if (version !== this.version)
    {
      throw new Error("Failed to deserialize because"
        + " version of JSON data (" + version + ")"
        + this.composePathString(path) + " doesn't"
        + " match required version (" + this.version + ")");
    }
  }

  // ! Throws exception on error.
  // Attempts to convert 'param.sourceProperty' to FastBitSet object.
  // -> Returns 'undefined' if 'param.sourceProperty' is not a bitvector.
  private deserializeAsBitvector(param: DeserializeParam)
  {
    if (!this.isBitvectorRecord(param.sourceProperty))
      return undefined;

    let targetIsValid =
         param.targetProperty === null
      || param.targetProperty === undefined
      || Types.isBitvector(param.targetProperty);

    if (!targetIsValid)
    {
      throw new Error("Failed to deserialize because target"
        + " property '" + param.propertyName + "'"
        + this.composePathString(param.path)
        + " is not 'null' or 'bitvector' when deserializing"
        + " property of type 'bitvector'");
    }

    return this.readBitvector(param);
  }

  // ! Throws exception on error.
  // Attempts to convert 'param.sourceProperty' to Set object.
  // -> Returns 'undefined' if 'param.sourceProperty' is not a Set.
  private deserializeAsSet(param: DeserializeParam)
  {
    if (!this.isSetRecord(param.sourceProperty))
      return undefined;

    let targetIsValid =
         param.targetProperty === null
      || param.targetProperty === undefined
      || Types.isSet(param.targetProperty);

    if (!targetIsValid)
    {
      throw new Error("Failed to deserialize because target"
        + " property '" + param.propertyName + "'"
        + this.composePathString(param.path)
        + " is not 'null' or 'Set' when deserializing"
        + " property of type 'Set'");
    }

    return this.readSet(param);
  }

  // ! Throws exception on error.
  // Attempts to convert 'param.sourceProperty' to Map object.
  // -> Returns 'undefined' if 'param.sourceProperty' is not a Map.
  private deserializeAsMap(param: DeserializeParam)
  {
    if (!this.isMapRecord(param.sourceProperty))
      return undefined;

    let targetIsValid =
         param.targetProperty === null
      || param.targetProperty === undefined
      || Types.isMap(param.targetProperty);

    if (!targetIsValid)
    {
      throw new Error("Failed to deserialize because target"
        + " property '" + param.propertyName + "'"
        + this.composePathString(param.path)
        + " is not 'null' or 'Map' when deserializing"
        + " property of type 'Map'");
    }

    return this.readMap(param);
  }

  // Attempts to convert 'param.sourceProperty' to reference to an Entity.
  // -> Returns 'undefined' if 'param.sourceProperty' is not an Entity
  //    reference.
  private deserializeAsEntityReference(param: DeserializeParam)
  {
    if (!this.isReference(param.sourceProperty))
      return undefined;

    return this.readEntityReference(param);
  }

  // ! Throws exception on error.
  // Attempts to convert 'param.sourceProperty' to Array.
  // -> Returns 'undefined' if 'param'.sourceProperty is not an Array.
  private deserializeAsArray(param: DeserializeParam)
  {
    if (!Array.isArray(param.sourceProperty))
      return undefined;

    // Here we need to use Utils.isArray() instead of Array.isArray()
    // because 'param.targetProperty' can be a {} with an array
    // as it's prototype created by object.create().
    let targetIsValid =
         param.targetProperty === null
      || param.targetProperty === undefined
      || Types.isArray(param.targetProperty);

    if (!targetIsValid)
    {
      throw new Error("Failed to deserialize because target"
        + " property '" + param.propertyName + "'"
        + this.composePathString(param.path)
        + " is not 'null' or 'Array' when deserializing"
        + " property of type 'Array'");
    }

    return this.readArray(param);
  }

  // ! Throws exception on error.
  // Attempts to convert 'param.sourceProperty' to a respective object.
  // -> Returns 'undefined' if 'param'.sourceProperty is not an object
  //    or if loading failed.
  private deserializeAsObject(param: DeserializeParam)
  {
    if (Types.isPrimitiveType(param.sourceProperty))
      return undefined;

    let targetIsValid =
         param.targetProperty === null
      || param.targetProperty === undefined
      || !Types.isPrimitiveType(param.targetProperty);

    if (!targetIsValid)
    {
      throw new Error("Failed to deserialize because target"
        + " property '" + param.propertyName + "'"
        + this.composePathString(param.path)
        + " is not 'null' 'undefined' or 'object'"
        + " when deserializing 'object' property");
    }

    return this.readObject(param);
  }

  // ! Throws exception on error.
  private readObject(param: DeserializeParam)
  {
    let instance = param.targetProperty;

    // If target property is 'null' or 'undefined', we wouldn't be
    // able to write anything to it or call it's deserialize method.
    // So we first need to assign a new instance of correct type to
    // it - the type is saved in JSON as 'className' property.
    if (instance === null || instance === undefined)
      instance = this.createNew(param);

    if (instance === null || instance === undefined)
    {
      throw new Error("Failed to instantiate property '" + param.propertyName + "'"
        + this.composePathString(param.path));
    }

    if (this.isDeserializable(instance))
    {
      return instance.deserialize(param.sourceProperty, param.path);
    }

    if (!Types.isPlainObject(instance))
    {
      throw new Error("Attempt to deserialize a nonprimitive property which"
        + " is neither an instance of Serializable class nor a plain"
        + " Javascript Object. This means that you have a class inherited"
        + " from Serializable and you put a property in it which is"
        + " neither inherited from Serializable nor a special type"
        + " handled in Serializable.ts (like Set, Map, etc.). You either"
        + " have to extend this property from Serializable class or add"
        + " code to Serializable to handle it's serialization");
    }

    // We are loading a primitive Javascript Object.
    return this.deserializePlainObject
    (
      {
        propertyName: param.propertyName,
        sourceProperty: param.sourceProperty,
        // We will be loading into our possibly newly created instance.
        targetProperty: instance,
        path: param.path
      }
    );
  }

  // ! Throws exception on error.
  // Reads 'className' from 'param.sourceProperty'
  // and creates an instance of that class.
  private createNew(param: DeserializeParam): Object
  {
    let className = param.sourceProperty[CLASS_NAME];

    // If there isn't a 'className' property in source object,
    // we will load into a plain Object.
    if (className === undefined)
      return {};

    // We don't have to check if 'className' is an Entity class,
    // because entities are always serialized as a reference. So if
    // there is an instance of some Serializable class saved directly
    // in JSON, it can't be an entity class.

    let Class = Classes.serializableClasses.get(className);

    if (!Class)
    {
      let pathString = this.composePathString(param.path);

      // We can't safely recover from this error, it could corrupt the
      // data.
      throw new Error("Unable to create instance of class"
        + " '" + className + "' when deserializing property"
        + " '" + param.propertyName + "'" + this.composePathString(param.path)
        + " because no such class is registered in Classes."
        + " Maybe you forgot to add 'Classes.registerSerializableClass("
        + className + ");' to the end of " + className + ".ts file?"
        + " Another possible reason is that you haven't imported"
        + " class {" + className + "} or you haven't used it so"
        + " typescript only imported it as type and didn't execute"
        + " code in the module");
    }

    try
    {
      return new Class;
    }
    catch (error)
    {
      throw new Error("Unable to create instance of class"
        + " '" + className + "' when deserializing property"
        + " '" + param.propertyName + "'"
        + this.composePathString(param.path));
    }
  }

  // ! Throws exception on error.
  private deserializePlainObject(param: DeserializeParam)
  {
    // We are cycling over properties in source object, not in
    // object that is being loaded. It means that we are only
    // overwriting properties that exist on the source object.
    //   We are not, however, enforing that source properties
    // exist in target object because that would prevent
    // deserializing plain Javascript Objects to a 'null' value
    // property (properties with 'null' value are instantiated
    // as {} before writing into them so they don't have any
    // properties).
    //   The same is true for loading Array items (the don't exist
    // prior to loading) which applies to Map and Set objects as well
    // (because they are serialized as Arrays).
    for (let propertyName in param.sourceProperty)
    {
      // Deserializing of each property may require special handling
      // so we use readProperty() which will do it for us.
      param.targetProperty[propertyName] = this.deserializeProperty
      (
        {
          propertyName: param.propertyName,
          // We pass 'null' as 'targetProperty' to make
          // readObject() create a new instance for us.
          targetProperty: null,
          sourceProperty: param.sourceProperty[propertyName],
          path: param.path
        }
      );
    }

    return param.targetProperty;
  }

  // Checks if 'param.sourceProperty' represents a saved FastBitSet object.
  private isBitvectorRecord(jsonObject: Object): boolean
  {
    if (!jsonObject)
      return false;

    return (jsonObject as any)[CLASS_NAME] === BITVECTOR_CLASS_NAME;
  }

  // Checks if 'param.sourceProperty' represents a saved Set object.
  private isSetRecord(jsonObject: Object): boolean
  {
    if (!jsonObject)
      return false;

    return (jsonObject as any)[CLASS_NAME] === SET_CLASS_NAME;
  }

  // Checks if 'param.sourceProperty' represents a saved Map object.
  private isMapRecord(jsonObject: Object): boolean
  {
    if (!jsonObject)
      return false;

    return (jsonObject as any)[CLASS_NAME] === MAP_CLASS_NAME;
  }

  // Checks if 'param.sourceProperty' represents a saved reference to
  // an entity.
  private isReference(jsonObject: Object): boolean
  {
    if (!jsonObject)
      return false;

    return (jsonObject as any)[CLASS_NAME] === REFERENCE_CLASS_NAME;
  }

  // Converts 'param.sourceProperty' to a FastBitSet object.
  private readBitvector(param: DeserializeParam)
  {
    return new FastBitSet(this.getProperty(param, BITVECTOR));
  }

  // ! Throws exception on error.
  private readSet(param: DeserializeParam): Set<any> | null
  {
    // In order to deserialize a Set object, we need to load all items
    // in array which represents it in serialized form, because they
    // may require special handling themselves (for example if you put
    // another Set into your Set). We let readArray() do it for us.
    let deserializedArray = this.readArray
    (
      {
        propertyName: 'Serialized record: Set',
        targetProperty: [],   // Load into a new array.
        sourceProperty: this.getProperty(param, SET),
        path: param.path
      }
    );

    return new Set(deserializedArray);
  }

  // ! Throws exception on error.
  // Converts 'param.sourceProperty' to a Map object.
  private readMap(param: DeserializeParam): Map<any, any> | null
  {
    // In order to deserialize a Map object, we need to load all items
    // in array which represents it in serialized form, because they
    // may require special handling themselvs (for example if you put
    // another Map into your Map). We let readArray() do it for us.
    let deserializedArray = this.readArray
    (
      {
        propertyName: 'Serialized record: Map',
        targetProperty: [],   // Load into a new array.
        sourceProperty: this.getProperty(param, MAP),
        path: param.path
      }
    );

    return new Map(deserializedArray);
  }

  // ! Throws exception on error.
  // Converts 'param.sourceProperty' to a reference to an Entity.
  // If 'id' loaded from JSON already exists in Entities, existing
  // entity will be returned. Otherwise an 'invalid'
  // entity reference will be created and returned.
  // -> Retuns an existing entity or an invalid entity reference.
  private readEntityReference(param: DeserializeParam)
  {
    let id = this.getProperty(param, ID);

    // Note:
    //   We need to use Application.entities instead of Entities because
    //   importing Entities to Serializable would cause cyclical module
    //   dependancy (Entities import Entity which imports Serializable).
    //   Doing this using Application.entities for some reason works.
    // return Application.entities.getReference(id);
    return Classes.entities.getReference(id);
  }

  // ! Throws exception on error.
  // Converts 'param.sourceProperty' to Array.
  private readArray(param: DeserializeParam): Array<any> | null
  {
    let array = param.sourceProperty;

    if (array === null || array === undefined)
    {
      throw new Error("Failed to deserialize array because source"
        + " property '" + param.propertyName + "' is invalid"
        + this.composePathString(param.path));
    }
    
    if (!Array.isArray(array))
    {
      throw new Error("Failed to deserialize array because source"
        + " property '" + param.propertyName + "' is not an array"
        + this.composePathString(param.path));
    }

    let newArray = [];

    for (let i = 0; i < array.length; i++)
    {
      newArray.push
      (
        this.readArrayItem(array[i], i, param.path)
      );
    }

    return newArray;
  }

  // ! Throws exception on error.
  // ('index' and 'path' are used only for error messages).
  private readArrayItem(item: any, index: number, path?: string)
  {
    // Let 'readProperty()' method load the contents of an array item.
    return this.deserializeProperty
    (
      {
        propertyName: 'Array item [' + index + ']',
        // We pass 'null' as 'targetProperty' to make
        // readObject() create a new instance for us.
        targetProperty: null,
        sourceProperty: item,
        path: path
      }
    );
  }

  private isDeserializable(instance: any): boolean
  {
    return ('deserialize' in instance);
  }  

  // ! Throws exception on error.
  private getProperty(param: DeserializeParam, propertyName: string)
  {
    if (!param.sourceProperty)
    {
      throw new Error("Failed to deserialize because source property"
        + " '" + param.propertyName + "'" + this.composePathString(param.path)
        + " isn't valid");
    }
    
    let property = param.sourceProperty[propertyName];

    if (property === undefined || property === null)
    {
      throw new Error("Failed to deserialize because property"
        + " '" + propertyName + "'" + this.composePathString(param.path)
        + " isn't valid");
    }

    return property;
  }

  private createSaver(className: string)
  {
    let saver = new Serializable();

    // Fake the 'className' getter.    
    saver['getClassName'] = function() { return className; };

    return saver;
  }

  // ! Throws exception on error.
  private createSetSaver(set: Set<any>)
  {
    if (set === null)
    {
      throw new Error("Failed to create set saver because set"
      + " which should be saved is 'null'");
    }

    let saver = this.createSaver(SET_CLASS_NAME);

    // Set is saved as it's Array representation to property 'set'.
    (saver as any)[SET] = this.saveSetToArray(set);

    return saver;
  }

  // ! Throws exception on error.
  private createMapSaver(map: Map<any, any>)
  {
    if (map === null)
    {
      throw new Error("Failed to create map saver because map"
        + " which should be saved is 'null'");
    }

    let saver = this.createSaver(MAP_CLASS_NAME);

    // Map is saved as it's Array representation to property 'map'.
    (saver as any)[MAP] = this.saveMapToArray(map);

    return saver;
  }

  // ! Throws exception on error.
  private createBitvectorSaver(bitvector: any)
  {
    if (bitvector === null)
    {
      throw new Error("Failed to create bitvector saver because"
      + " bitvector which should be saved is 'null'");
    }

    let saver = this.createSaver(BITVECTOR_CLASS_NAME);

    // Bitvector is saved as it's JSON string representation to
    // property 'bitvector'.
    (saver as any)[BITVECTOR] = bitvector.toJSON();

    return saver;
  }

  // ! Throws exception on error.
  private createEntitySaver(entity: Serializable): Serializable
  {
    if (entity === null)
    {
      throw new Error("Failed to create entity saver because entity"
        + " which should be saved is 'null'");
    }

    let id = (entity as any)[ID];

    if (!id)
    {
      throw new Error("Failed to create entity saver because entity"
        + " which should be saved doesn't have valid id");
    }

    let saver = this.createSaver(REFERENCE_CLASS_NAME);

    // Only a string id is saved when an entity is serialized.
    (saver as any)[ID] = id;

    return saver;
  }

  // -> Returns an Array representation of Set object.
  private saveSetToArray(set: Set<any>): Array<any>
  {
    let result = [];

    for (let entry of set.values())
      result.push(entry);
    
    return result;
  }

  // -> Returns an Array representation of Map object.
  private saveMapToArray(map: Map<any, any>): Array<any>
  {
    let result = [];

    for (let entry of map.entries())
      result.push(entry);
    
    return result;
  }

  // -> Returns string informing about file location or empty string
  //    if 'path' is not available.
  private composePathString(path?: string)
  {
    if (!path)
      return "";

    return " in file " + path;
  }
}

// ------------------ Type declarations ----------------------

interface DeserializeParam
{
  propertyName: string,
  sourceProperty: any,
  targetProperty: any,
  path?: string
}

interface SerializeParam
{
  property: any,
  description: string, // Used for error messages.
  className: string,
  mode: Serializable.Mode
}

export module Serializable
{
  export type Mode =
    'Save to File' |
    'Send to Client' |
    'Send to Server' |
    'Send to Editor';
}