/*
  Part of Kosmud

  Allows serializing to and from JSON format.
*/
define(["require", "exports", "../../Shared/ERROR", "../../Shared/FATAL_ERROR", "../../Shared/Utils", "../../Shared/Class/Classes", "../../Shared/Class/JsonObject", "../../Shared/Class/Attributable"], function (require, exports, ERROR_1, FATAL_ERROR_1, Utils_1, Classes_1, JsonObject_1, Attributable_1) {
    /*
      Note:
        Only saved properties are loaded. Properties that are not present in the
        save will not get overwritten. It means that you can add new properties
        to existing classes without converting existing save files (but you should
        initialize them with default values of course).
    
      Note:
        Only properties that exist on the class that is being loaded are loaded
        from save. It means that you can remove properties from existing classes
        without converting existing save files.
          This does not apply to primitive Javascript Object properties (including
        properties defined using a Typescript Interface) because we need to be able
        to create properties in empty Javascript Objects when we are loading Array
        items (which never exist prior to loading).
    
        (See deserialize() and deserializePlainObject() methods for details.)
    */
    /*
      Pozn:
        Momentálně se static properties checkují jen pro přímé properties
        Serializable instance. Tj. když do entity dám plain {}, tak u jeho
        properties nemůžu říct, jestli se mají serializovat a jak se mají
        editovat. Můžu ale místo něj udělat classu zděděnou ze Serializable,
        u té to opět říct můžu.
    
        Když bych to chtěl změnit, tak by to asi znamenalo do SerializeParam
        přidat staticAttributes, do kterých se budu rekurzivně zanořovat.
        (A samozřejmě tuhle funkcionalitu přidat do Attributable class).
    */
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    // 3rd party modules.
    let FastBitSet = require('fastbitset');
    class Serializable extends Attributable_1.Attributable {
        constructor() {
            super(...arguments);
            // ---------------- Protected data --------------------
            // Version will be checked for. Default behaviour is to trigger
            // an ERROR when versions don't match. You can change it by
            // overriding a checkVersion() method.
            //   It is also a good idea to override 'version' property in
            // descendant classes and increment it when you change the properties.
            this.version = 0;
        }
        static get ID_PROPERTY() { return 'id'; }
        static get VERSION_PROPERTY() { return 'version'; }
        static get CLASS_NAME_PROPERTY() { return 'className'; }
        // These are 'dummy' class names. They are only written to JSON
        // but they don't really exists in code (Set and Map are build-in
        // javascript classes, Bitvector translates to a FastBitArray
        // class and Reference is not a class at all but a reference to
        // an Entity.
        static get BITVECTOR_CLASS_NAME() { return 'Bitvector'; }
        ///private static get DATE_CLASS_NAME()        { return 'Date'; }
        static get SET_CLASS_NAME() { return 'Set'; }
        static get MAP_CLASS_NAME() { return 'Map'; }
        static get REFERENCE_CLASS_NAME() { return 'Reference'; }
        // These special property names are only written to serialized data.
        // For example 'map' property holds an Array that represents serialized
        // data of a Map object.
        static get BITVECTOR_PROPERTY() { return 'bitvector'; }
        ///private static get DATE_PROPERTY()          { return 'date'; }
        static get MAP_PROPERTY() { return 'map'; }
        static get SET_PROPERTY() { return 'set'; }
        // ------------- Public static methods ----------------
        // Use this only for plain Serializable objects, not entities.
        // -> Returns 'null' on failure.
        static deserialize(data) {
            let jsonObject = JsonObject_1.JsonObject.parse(data);
            if (!jsonObject)
                return null;
            let className = jsonObject[Serializable.CLASS_NAME_PROPERTY];
            if (!className) {
                ERROR_1.ERROR("Unable to deserialize data because there is"
                    + " no '" + Serializable.CLASS_NAME_PROPERTY + "'"
                    + " property in it");
                return null;
            }
            let Class = Classes_1.Classes.serializables.get(className);
            if (!Class) {
                ERROR_1.ERROR("Unable to deserialize data because class '" + className + "'"
                    + " isn't registered in Classes as a serializable non-entity class");
                return null;
            }
            let instance = new Class;
            return instance.deserialize(jsonObject);
        }
        // ---------------- Public methods --------------------
        dynamicCast(Class) {
            // Dynamic type check - we make sure that entity is inherited from
            // requested class (or an instance of the class itself).
            if (!(this instanceof Class)) {
                ERROR_1.ERROR("Type cast error: serializable"
                    + " object " + this.getErrorIdString()
                    + " is not an instance of requested"
                    + " type (" + Class.name + ")");
                return null;
            }
            return this;
        }
        // Returns string describing this object for error logging.
        getErrorIdString() {
            // There is not much to say about generic serializable object.
            return "{ className: " + this.getClassName() + " }";
        }
        serialize(mode) {
            let jsonObject = this.saveToJsonObject(mode);
            if (jsonObject === undefined)
                return "";
            return JsonObject_1.JsonObject.stringify(jsonObject);
        }
        // TODO: This should not be in Serializable.
        //   // Extracts data from plain javascript Object to this instance.
        //   // -> Returns 'null' on failure.
        //   public recreateEntity(jsonObject: Object, path: (string | null) = null)
        //   : Serializable | null
        //   {
        //     // Check version and input data validity.
        //     if (!this.deserializeCheck(jsonObject, path))
        //       return null;
        //     // Copy all properties from 'jsonObject'.
        //     for (let propertyName in jsonObject)
        //     {
        //       // Property 'className' isn't assigned (it represents the
        //       // name of the javascript class which cannot be changed).
        //       if (propertyName === Serializable.CLASS_NAME_PROPERTY)
        //         continue
        //       // Property 'version' also isn't assigned - it is saved only
        //       // to allow for custom loading code when it changes.
        //       if (propertyName === Serializable.VERSION_PROPERTY)
        //         continue;
        // /// TODO: Tohle asi není dobrej nápad, nepůjdou díky tomu vytvářet
        // ///   properties v runtimu (tedy půjdou, ale po savu/loadu se ztratí).
        //       // Only properties that exist on the class that is being loaded
        //       // are loaded from save. It means that you can remove properties
        //       // from existing classes without converting existing save files
        //       // (no syslog message is generated).
        //       //   Note that if a property is not initialized in typescript,
        //       // it's not created on javascript instance at all - so make sure
        //       // that you initialize all properties if you want them to be
        //       // deserialized.
        //       /// if (!(propertyName in this))
        //       ///   continue;
        //       // Allow custom property deserialization in descendants.
        //       let customValue = this.customDeserializeProperty
        //       (
        //         propertyName,
        //         (jsonObject as any)[propertyName]
        //       );
        //       if (customValue !== undefined)
        //       {
        //         (this as any)[propertyName] = customValue;
        //         continue;
        //       }
        //       let param: DeserializeParam =
        //       {
        //         propertyName: propertyName,
        //         targetProperty: (this as any)[propertyName],
        //         sourceProperty: (jsonObject as any)[propertyName],
        //         path: path
        //       };
        //       // We are cycling over properties in JSON object, not in Serializable
        //       // that is being loaded. It means that properties that are not present
        //       // in the save will not get overwritten with 'undefined'. This allows
        //       // adding new properties to existing classes without the need to
        //       // convert all save files.
        //       (this as any)[propertyName] = this.deserializeProperty(param);
        //     }
        //     return this;
        //   }
        // -------------- Protected methods -------------------
        // -> Returns 'undefined' if property is not customly serialized.
        customSerializeProperty(propertyName) {
            return undefined;
        }
        // -> Returns 'undefined' if property is not customly deserialized.
        customDeserializeProperty(propertyName, sourceProperty) {
            return undefined;
        }
        //+
        checkVersion(jsonObject, path = null) {
            let version = jsonObject[Serializable.VERSION_PROPERTY];
            // Note: '0' is a valid 'version'.
            if (version === undefined) {
                let pathString = this.composePathString(path);
                ERROR_1.ERROR("Missing '" + Serializable.VERSION_PROPERTY + "' property"
                    + " in JSON data" + pathString);
                return false;
            }
            if (version !== this.version) {
                let pathString = this.composePathString(path);
                ERROR_1.ERROR("Version of JSON data"
                    + " (" + jsonObject[Serializable.VERSION_PROPERTY] + ")"
                    + pathString + " doesn't match required version"
                    + " (" + this.version + ")");
                return false;
            }
            return true;
        }
        // --------------- Private methods --------------------
        ///////////////////////////////////////////////////////
        ///////////////////// JsonSaver ///////////////////////
        ///////////////////////////////////////////////////////
        writeVersion(jsonObject) {
            let version = this[Serializable.VERSION_PROPERTY];
            // Note: '0' is a valid 'version'.
            if (version === undefined) {
                ERROR_1.ERROR("Missing '" + Serializable.VERSION_PROPERTY + "' property"
                    + " in " + this.getErrorIdString());
                jsonObject[Serializable.VERSION_PROPERTY] = '<missing version>';
                return;
            }
            // Always save 'version' even if it's not own property.
            // ('version' property is used when loading from file
            //  to enable custom loading code when data structure
            //  chances. It is not loaded, only checked against
            // current version.)
            jsonObject[Serializable.VERSION_PROPERTY] = version;
        }
        //+
        // Creates a primitive Javascript Object and fills it with serialized
        // properties of 'this'. Data types that can't be directly serialized
        // to JSON (like Set or Map) are converted to their serializable
        // equivalents (Array, string, etc).
        //   Properties with static attribute matching given serialization 'mode'
        // set to 'false' are not serialized.
        // -> Returns 'undefined' if serialization fails.
        saveToJsonObject(mode) {
            let jsonObject = {};
            // A little hack - serialize 'name' property first (out of order)
            // to make saved JSON files more readable.
            // (Only if it's own property though - if we are inheriting it,
            //  we can't save it.)
            if (this.hasOwnProperty('name'))
                jsonObject['name'] = this['name'];
            // Another hack for 'version' property.
            this.writeVersion(jsonObject);
            // Anoter readability hack - serialize 'className'.
            jsonObject[Serializable.CLASS_NAME_PROPERTY] = this.getClassName();
            // Cycle through all properties in source object.
            for (let propertyName in this) {
                // Skip 'name' property because it's already saved by hack.
                if (propertyName === 'name')
                    continue;
                // Skip 'version' property because it's already saved by hack.
                if (propertyName === Serializable.VERSION_PROPERTY)
                    continue;
                // Skip inherited properties (they are serialized on prototype entity).
                if (!this.hasOwnProperty(propertyName))
                    continue;
                let sourceProperty = this[propertyName];
                // Also skip properties that are instantiated (because they are
                // nonprimitive) but are completely inherited from prototype.
                if (!this.hasOwnValue(sourceProperty))
                    continue;
                // Check if property is to be serialized in this serialization mode.
                if (!this.isSerialized(propertyName, mode))
                    continue;
                // Allow custom property serialization in descendants.
                let customValue = this.customSerializeProperty(propertyName);
                if (customValue !== undefined) {
                    jsonObject[propertyName] = customValue;
                    continue;
                }
                let serializeParam = {
                    sourceProperty: sourceProperty,
                    description: propertyName,
                    className: this.getClassName(),
                    mode: mode
                };
                jsonObject[propertyName] =
                    this.serializeProperty(serializeParam);
            }
            return jsonObject;
        }
        //+
        // Determines if property 'propertyName' is to be serialized
        // in given serializable 'mode'.
        isSerialized(propertyName, mode) {
            // Access static variable named the same as property.
            let attributes = this.getAttributes(propertyName);
            // If static attributes for this property don't exist, it means
            // it should always be serialized.
            if (attributes === undefined)
                return true;
            // Default value is always 'true', so if for example attributs.saved
            // isn't defined (it's not 'false'), we will return 'true'.
            switch (mode) {
                case Serializable.Mode.SAVE_TO_FILE:
                    return attributes.saved !== false;
                case Serializable.Mode.SEND_TO_CLIENT:
                    return attributes.sentToClient !== false;
                case Serializable.Mode.SEND_TO_SERVER:
                    return attributes.sentToServer !== false;
                case Serializable.Mode.SEND_TO_EDITOR:
                    return attributes.edited !== false;
                default:
                    ERROR_1.ERROR('Unhandled Serializable.Mode');
                    break;
            }
            // Once again, default value is 'true'.
            return true;
        }
        // Writes a single property to a corresponding JSON object.
        // -> Returns JSON Object representing 'param.sourceProperty'. 
        serializeProperty(param) {
            let property = param.sourceProperty;
            let mode = param.mode;
            if (property === null)
                return null;
            if (Utils_1.Utils.isPrimitiveType(property))
                // Primitive values (number, string, etc.) are just assigned.
                return property;
            if (Utils_1.Utils.isArray(property))
                return this.serializeArray(param, property);
            // If there is an 'id' in the property, we treat it as Entity.
            if (property[Serializable.ID_PROPERTY] !== undefined)
                // Entities are saved to a separate files. Only a reference
                //   (using a string id) to an entity will be saved.
                return this.createEntitySaver(property).saveToJsonObject(mode);
            // property is a Serializable object (but not an entity).
            if (this.isSerializable(property))
                return property.saveToJsonObject(mode);
            // Date() should no longer be used, Time() should be used instead.
            /// if (Utils.isDate(property))
            ///   return this.createDateSaver(property).saveToJsonObject(mode);
            if (Utils_1.Utils.isDate(property)) {
                this.reportSerializeDateErorr();
                return null;
            }
            if (Utils_1.Utils.isMap(property))
                return this.createMapSaver(property).saveToJsonObject(mode);
            if (Utils_1.Utils.isBitvector(property))
                return this.createBitvectorSaver(property).saveToJsonObject(mode);
            if (Utils_1.Utils.isSet(property))
                return this.createSetSaver(property).saveToJsonObject(mode);
            if (Utils_1.Utils.isPlainObject(property))
                return this.serializePlainObject(property);
            ERROR_1.ERROR("Property '" + param.description + "' in class"
                + " '" + param.className + "' (or inherited from one of it's"
                + " ancestors) is a class but is neither inherited from"
                + " Serializable nor has a type that we know how to save."
                + " Make sure that you only use primitive types (numbers,"
                + " strings, etc.), Arrays, primitive javascript Objects,"
                + " Maps or classes inherited from Serializable as properties"
                + " of classes inherited from Serializable. If you want a new"
                + " type to be saved, you need to add this functionality to "
                + " Serializable.ts. Property is not saved");
            return null;
        }
        // ------------------------------------------------- //
        //          Data type serialization methods          //
        // ------------------------------------------------- //
        //+
        // Saves a property of type Array to a corresponding JSON Array object.
        serializeArray(param, sourceArray) {
            let jsonArray = [];
            // To serialize an Array we need to serialize all of it's items.
            for (let i = 0; i < sourceArray.length; i++) {
                // Note: 'saved' static attribute is not tested for members of an array.
                // Either the whole array is saved, or it's not saved at all. Having
                // 'holes' in an array after loading (probably with <null> values) would
                // certainly be confusing.
                // Setup a new serialize param.
                let serializeParam = {
                    sourceProperty: sourceArray[i],
                    description: "Array item [" + i + "]",
                    className: param.className,
                    mode: param.mode
                };
                jsonArray.push(this.serializeProperty(serializeParam));
            }
            return jsonArray;
        }
        hasOwnValue(object) {
            /// Deprecated.
            /*
            // When an instance is created from an Array using
            // Object.create([0]), it behaves as a regular Object:
            // instance.hasOwnProperty('0') will be 'false' (because
            // this first item is inherited from prototype.
            //   If you do instance.push(1), instance.hasOwnProperty('0')
            // will still be 'false' and instance.hasOwnProperty('1')
            // will be true (because property '1). There will also be
            // an own property 'length' defined by you pop - and that's
            // what we are going to exploit to find out that an instance
            // of an array has own value (rather than being completely
            // inherited from prototype).
            if (Utils.isArray(value) && !value.hasOwnProperty('length'))
              return false;
            */
            // Properties of primitive types are always serialized.
            if (Utils_1.Utils.isPrimitiveType(object))
                return true;
            if (Utils_1.Utils.isMap(object) || Utils_1.Utils.isSet(object)) {
                // Maps and Sets are always instantiated as 'new Map()'
                // or 'new Set()'. We only serialize them if they contain
                // anything.
                return object.size !== 0;
            }
            // Other objects (nonprimitive properties) are only saved
            // if they contain any own (not inherited) properties which
            // have own (not inherited) value themselves.
            for (let propertyName in object) {
                if (!object.hasOwnProperty(propertyName))
                    continue;
                if (this.hasOwnValue(object[propertyName]))
                    return true;
            }
            return false;
        }
        //+
        // The purpose of manual saving of properties of primitive Objects
        // is to determine if some of them are SaveableObjects so they need
        // to be saved using their saveToJsonObject() method.
        // (this check is done within this.saveVariable() call)
        serializePlainObject(param) {
            let sourceObject = param.sourceProperty;
            if (sourceObject === null)
                return null;
            let jsonObject = {};
            // Serialize all properties of sourceObject.
            for (let propertyName in sourceObject) {
                let sourceProperty = sourceObject[propertyName];
                // Skip properties that are instantiated (because they are
                // nonprimitive) but are completely inherited from prototype.
                if (!this.hasOwnValue(sourceProperty))
                    continue;
                // Setup a new serialize param.
                let serializeParam = {
                    sourceProperty: sourceProperty,
                    description: propertyName,
                    className: 'Object',
                    mode: param.mode
                };
                jsonObject[propertyName] = this.serializeProperty(serializeParam);
            }
            return jsonObject;
        }
        // ------------------------------------------------- //
        //                 Auxiliary methods                 //
        // ------------------------------------------------- //
        //+
        isSerializable(variable) {
            return ('saveToJsonObject' in variable);
        }
        ///////////////////////////////////////////////////////
        ///////////////////// JsonLoader //////////////////////
        ///////////////////////////////////////////////////////
        //+
        // Deserializes a single property from corresponding JSON object.
        // Converts from serializable format to original data type as needed
        // (for example Set class is saved to JSON as an Array so it has to be
        //  reconstructed here).
        deserializeProperty(param) {
            let result;
            // First handle the case that property in JSON has null value. In that
            // case target property will also be null, no matter what type it is.
            if (param.sourceProperty === null)
                return null;
            // Attempt to load property as FastBitSet object.
            if (result = this.deserializeAsBitvector(param))
                return result;
            // Date() should no longer be used. Use Time() instead.
            // // Attempt to load property as Date object.
            // if (result = this.deserializeAsDate(param))
            //   return result;
            // Attempt to load property as Set object.
            if (result = this.deserializeAsSet(param))
                return result;
            // Attempt to load property as Map object.
            if (result = this.deserializeAsMap(param))
                return result;
            // TODO: This should not be in Serializable.
            // // Attempt to load property as a reference to an Entity.
            // if (result = this.deserializeAsEntityReference(param))
            //   return result;
            // Attempt to load property as Array
            if (result = this.deserializeAsArray(param))
                return result;
            // Attempt to load property as an object
            // (including custom classes).
            //   Note that this would also mean Arrrays and all other
            // nonprimitive types, so they must be handled before this.
            if (result = this.deserializeAsObject(param))
                return result;
            // If propety has neither of types we have just tried,
            // we load it as primitive type (primitive properties
            // are simply assigned).
            return param.sourceProperty;
        }
        // ------------------------------------------------- //
        //        Version and data checking methods          //
        // ------------------------------------------------- //
        //+
        // Checks that version and className match and that 'jsonObject' isn't null.
        // -> Returns 'false' if check fails.
        deserializeCheck(jsonObject, path = null) {
            // Using 'in' operator on object with null value would cause crash.
            if (jsonObject === null) {
                let pathString = this.composePathString(path);
                // Here we need fatal error, because data might already
                // be partialy loaded so we could end up with broken entity.
                ERROR_1.ERROR("Invalid JSON object" + pathString);
                return false;
            }
            // 'path' is passed just so it can be printed to error messages.
            if (!this.checkVersion(jsonObject, path))
                return false;
            // 'className' must be the same as it's saved value.
            if (!this.checkClassName(jsonObject, path))
                return false;
            return true;
        }
        //+
        // Checks that 'jsonObject' contains property 'className'.
        checkClassName(jsonObject, path = null) {
            let jsonClassName = jsonObject[Serializable.CLASS_NAME_PROPERTY];
            if (jsonClassName === undefined) {
                let pathString = this.composePathString(path);
                ERROR_1.ERROR("There is no '" + Serializable.CLASS_NAME_PROPERTY + "'"
                    + " property in JSON data" + pathString);
                return false;
            }
            if (jsonClassName !== this.getClassName()) {
                let pathString = this.composePathString(path);
                ERROR_1.ERROR("Attempt to load JSON data of class"
                    + " (" + jsonObject[Serializable.CLASS_NAME_PROPERTY] + ")"
                    + pathString + " into instance of different"
                    + " class (" + this.getClassName() + ")");
                return false;
            }
            return true;
        }
        // ------------------------------------------------- //
        //   Following methods check serialized data and     //
        //   deserialize it if it matches their data type    //
        // ------------------------------------------------- //
        //+
        // Attempts to convert 'param.sourceProperty' to FastBitSet object.
        // -> Returns 'null' if 'param'.sourceVariable is not a bitvector
        //    record or if loading failed.
        deserializeAsBitvector(param) {
            if (!this.isBitvectorRecord(param.sourceProperty))
                return null;
            if (
            // It's ok to load into 'null' property.
            param.targetProperty !== null
                && !Utils_1.Utils.isBitvector(param.targetProperty)) {
                let pathString = this.composePathString(param.path);
                ERROR_1.ERROR("Attempt to load bitvector property '" + param.propertyName + "'"
                    + pathString + " to a non-bitvector property");
                return null;
            }
            return this.readBitvector(param);
        }
        // Date() should no longer be used. Use Time() instead.
        // // Attempts to convert 'param.sourceProperty' to Date object.
        // // -> Returns 'null' if 'param'.sourceVariable is not a Date
        // //    record or if loading failed.
        // private deserializeAsDate(param: DeserializeParam)
        // {
        //   if (!this.isDateRecord(param.sourceProperty))
        //     return null;
        //   if (!Utils.isDate(param.targetProperty))
        //   {
        //     let pathString = this.composePathString(param.path);
        //     ERROR("Attempt to load Date property '" + param.propertyName + "'"
        //       + pathString + " to a non-Date property");
        //     return null;
        //   }
        //   return this.readDate(param);
        // }
        //+
        // Attempts to convert 'param.sourceProperty' to Set object.
        // -> Returns 'null' if 'param'.sourceVariable is not a Set
        //    record or if loading failed.
        deserializeAsSet(param) {
            if (!this.isSetRecord(param.sourceProperty))
                return null;
            if (
            // It's ok to load into 'null' property.
            param.targetProperty !== null
                && !Utils_1.Utils.isSet(param.targetProperty)) {
                let pathString = this.composePathString(param.path);
                ERROR_1.ERROR("Attempt to load Set property '" + param.propertyName + "'"
                    + pathString + " to a non-Set property");
                return null;
            }
            return this.readSet(param);
        }
        //+
        // Attempts to convert 'param.sourceProperty' to Map object.
        // -> Returns 'null' if 'param'.sourceVariable is not a Map
        //    record or if loading failed.
        deserializeAsMap(param) {
            if (!this.isMapRecord(param.sourceProperty))
                return null;
            if (
            // It's ok to load into 'null' property.
            param.targetProperty !== null
                && !Utils_1.Utils.isMap(param.targetProperty)) {
                let pathString = this.composePathString(param.path);
                ERROR_1.ERROR("Attempt to load Map property '" + param.propertyName + "'"
                    + pathString + " to a non-Map property");
                return null;
            }
            return this.readMap(param);
        }
        // TODO: This should not be in Serializable.
        // // Attempts to convert 'param.sourceProperty' to the reference
        // // to an Entity.
        // // -> Returns 'null' if 'param'.sourceVariable is not an entity
        // //    reference record or if loading failed.
        // private deserializeAsEntityReference(param: DeserializeParam)
        // {
        //   if (!this.isReference(param.sourceProperty))
        //     return null;
        //   return this.readEntityReference
        //   (
        //     param.sourceProperty,
        //     param.propertyName,
        //     this.composePathString(param.path)
        //   );
        // }
        //+
        // Attempts to convert 'param.sourceProperty' to Array.
        // -> Returns 'null' if 'param'.sourceVariable is not an
        //    Array or if loading failed.
        deserializeAsArray(param) {
            if (!Array.isArray(param.sourceProperty))
                return null;
            // Here we need to use Utils.isArray() instead of Array.isArray()
            // because 'param.targetProperty' is probably a {} with an array
            // as it's prototype created by object.create().
            if (
            // It's ok to load into 'null' property.
            param.targetProperty !== null
                && !Utils_1.Utils.isArray(param.targetProperty)) {
                let pathString = this.composePathString(param.path);
                ERROR_1.ERROR("Attempt to load Array property '" + param.propertyName + "'"
                    + pathString + " to a non-Array property");
                return null;
            }
            return this.readArray(param);
        }
        //+
        // Attempts to convert 'param.sourceProperty' to a respective object.
        // -> Returns 'null' if 'param'.sourceVariable is not an object
        //    or if loading failed.
        deserializeAsObject(param) {
            if (Utils_1.Utils.isPrimitiveType(param.sourceProperty))
                return null;
            if (param.targetProperty !== null
                && param.targetProperty !== undefined
                && Utils_1.Utils.isPrimitiveType(param.targetProperty)) {
                let pathString = this.composePathString(param.path);
                ERROR_1.ERROR("Attempt to load nonprimitive property"
                    + " '" + param.propertyName + "'" + pathString
                    + " to a primitive property");
                return null;
            }
            return this.readObject(param);
        }
        //+
        readObject(param) {
            // If our corresponding property is null, it wouldn't be able to
            // load itself from JSON, because you can't call methods on null
            // object. So we first need to assign a new instance of correct
            // type to it - the type is saved in JSON as 'className' property.
            let instance = this.createNewIfNull(param);
            if (instance === null || instance === undefined) {
                let pathString = this.composePathString(param.path);
                ERROR_1.ERROR("Failed to instantiate property '" + param.propertyName + "'"
                    + pathString);
                return null;
            }
            // Handle Serializable objects.
            if (this.isDeserializable(instance)) {
                // If we are loading into a Serializable object, do it using it's
                // deserialize() method.
                instance.deserialize(param.sourceProperty, param.path);
                return instance;
            }
            if (!Utils_1.Utils.isPlainObject(instance)) {
                ERROR_1.ERROR("Attempt to deserialize a nonprimitive property which"
                    + " is neither an instance of Serializable class nor a plain"
                    + " Javascript Object. This means that you have a class inherited"
                    + " from Serializable and you put a property in it which is"
                    + " neither inherited from Serializable nor a special type"
                    + " handler in Serializable.ts (like Set, Map, etc.). You either"
                    + " have to exnted this property from Serializable or add code"
                    + " to Serializable to handle it's serialization");
                return null;
            }
            // Update load 'param' so it contains possibly newly created {}.
            param.targetProperty = instance;
            // We are loading a primitive Javascript Object.
            return this.deserializePlainObject(param);
        }
        // -> Returns 'param.targetProperty' if it's not 'null'.
        //    Creates and returns a new instance otherwise
        //    (type is read from 'param.sourceProperty.className').
        createNewIfNull(param) {
            let instance = param.targetProperty;
            // If the target property exists, we will be loading into it.
            if (instance !== null)
                return instance;
            // If target property doesn't exist, we have to create a new instance
            // (because 'null' has no properties so we can't call deserialize() on it).
            return this.createNew(param);
        }
        // Reads property 'className' from 'param.sourceProperty' and creates
        // an instance of that class.
        createNew(param) {
            // Read class name from JSON.
            let className = param.sourceProperty[Serializable.CLASS_NAME_PROPERTY];
            // If there isn't a 'className' property in jsonObject,
            // we will load into a plain Object.
            if (className === undefined)
                return {};
            // Otherwise we create an instance of such class.
            //   We don't have to check if 'className' is an Entity class,
            // because entities are always serialized as a reference. So if
            // there is an instance of some Serializable class saved directly
            // in Json, it can't be an entity class.
            let Class = Classes_1.Classes.serializables.get(className);
            if (!Class) {
                let pathString = this.composePathString(param.path);
                // We can't safely recover from this error, it could corrupt the
                // data.
                FATAL_ERROR_1.FATAL_ERROR("Unable to create instance of class '" + className + "'"
                    + " when deserializing property '" + param.propertyName + "'"
                    + pathString + " because no such class is registered in Classes."
                    + " Maybe you forgot to add 'Classes.registerSerializableClass("
                    + className + ");' to the end of " + className + ".ts file?"
                    + " Another possible reason is, that you haven't imported"
                    + " class {" + className + "} or you haven't used it so"
                    + " typescript only imported it as type, not as whole module"
                    + " (see shared/lib/connection/Connection for example how to"
                    + " force-import a module)");
                // This return never happens, we are just letting typescript know
                // that this case is handled.
                return null;
            }
            try {
                return new Class;
            }
            catch (error) {
                let pathString = this.composePathString(param.path);
                FATAL_ERROR_1.FATAL_ERROR("Unable to create instance of class '" + className + "'"
                    + " when deserializing property '" + param.propertyName + "'"
                    + pathString);
            }
            return null;
        }
        //+
        deserializePlainObject(param) {
            let instance = param.targetProperty;
            // Copy the data from sourceProperty.
            //   We are cycling over properties in JSON object, not in
            // object that is being loaded. It means that properties
            // that are not present in the save will not get overwritten.
            // This allows adding new properties to existing classes without
            // the need to convert all save files.
            for (let propertyName in param.sourceProperty) {
                // Here we do not enforce that properties from JSON exist
                // in target property, because that would prevent loading
                // plain Javascript Objects to a 'null' value (properties
                // with 'null' value are instantiated as {} before loading
                // into them).
                //   The same is true for loading Array items (the don't exist
                // prior to loading) which applies to Map and Set objects as well
                // (because they are serialized as Arrays).
                // Setup a new deserialize param.
                let deserializeParam = {
                    propertyName: param.propertyName,
                    // We need to pass 'null' as 'sourceProperty' so an instance
                    // of corect type will be created (by createNewIfNull()).
                    targetProperty: null,
                    sourceProperty: param.sourceProperty[propertyName],
                    path: param.path
                };
                // Deserializing of each property may require special handling
                // so we use readProperty() which will do it for us.
                instance[propertyName] = this.deserializeProperty(deserializeParam);
            }
            return instance;
        }
        // ------------------------------------------------- //
        //         Methods detecting 'fake' types            //
        //             of serialized records                 //
        // ------------------------------------------------- //
        //+
        // Checks if 'param.sourceProperty' represents a saved FastBitSet object.
        isBitvectorRecord(jsonObject) {
            if (this.isObjectValid(jsonObject) === false)
                return false;
            // Is there a 'className' property in JSON object
            // with value 'Bitvector'?
            if (jsonObject[Serializable.CLASS_NAME_PROPERTY]
                === Serializable.BITVECTOR_CLASS_NAME)
                return true;
            return false;
        }
        //+
        // Date() should no longer be used. Use Time() instead.
        // // Checks if 'param.sourceProperty' represents a saved Date object.
        // private isDateRecord(jsonObject: Object): boolean
        // {
        //   if (this.isObjectValid(jsonObject) === false)
        //     return false;
        //   // Is there a 'className' property in JSON object
        //   // with value 'Date'?
        //   if (jsonObject[Serializable.CLASS_NAME_PROPERTY]
        //       === Serializable.DATE_CLASS_NAME)
        //     return true;
        //   return false;
        // }
        //+
        // Checks if 'param.sourceProperty' represents a saved Set object.
        isSetRecord(jsonObject) {
            if (this.isObjectValid(jsonObject) === false)
                return false;
            // Is there a 'className' property in JSON object
            // with value 'Set'?
            if (jsonObject[Serializable.CLASS_NAME_PROPERTY]
                === Serializable.SET_CLASS_NAME)
                return true;
            return false;
        }
        //+
        // Checks if 'param.sourceProperty' represents a saved Map object.
        isMapRecord(jsonObject) {
            if (this.isObjectValid(jsonObject) === false)
                return false;
            // Is there a 'className' property in JSON object
            // with value 'Map'?
            if (jsonObject[Serializable.CLASS_NAME_PROPERTY]
                === Serializable.MAP_CLASS_NAME)
                return true;
            return false;
        }
        //+
        // Checks if 'param.sourceProperty' represents a saved reference to
        // an entity.
        isReference(jsonObject) {
            if (this.isObjectValid(jsonObject) === false)
                return false;
            // Is there a 'className' property in JSON object with value
            // 'Reference'?
            if (jsonObject[Serializable.CLASS_NAME_PROPERTY]
                === Serializable.REFERENCE_CLASS_NAME)
                return true;
            return false;
        }
        // ------------------------------------------------- //
        //      Methods converting serialized data into      //
        //       original structures (Set, Map, etc.).       //
        // ------------------------------------------------- //
        //+
        // Converts 'param.sourceProperty' to a FastBitSet object.
        readBitvector(param) {
            let sourceRecord = this.readSourceRecord(param, Serializable.BITVECTOR_PROPERTY);
            if (sourceRecord === null)
                return null;
            return new FastBitSet(sourceRecord);
        }
        //+
        // Date() should no longer be used. Use Time() instead.
        // // Converts 'param.sourceProperty' to a Date object.
        // private readDate(param: DeserializeParam): Date
        // {
        //   let sourceRecord =
        //     this.readSourceRecord(param, Serializable.DATE_PROPERTY);
        //   if (sourceRecord === null)
        //     return null;
        //   return new Date(sourceRecord);
        // }
        // Converts 'param.sourceProperty' to a Set object.
        readSet(param) {
            let sourceRecord = this.readSourceRecord(param, Serializable.SET_PROPERTY);
            if (sourceRecord === null)
                return null;
            // In order to deserialize a Set object, we need to load all items
            // in array which represents it in serialized form, because they
            // may require special handling themselves (for example if you put
            // another Set into your Set).
            // Setup a new deserialize param.
            let deserializeParam = {
                propertyName: 'Serialized record: Set',
                targetProperty: [],
                sourceProperty: sourceRecord,
                path: param.path
            };
            // Load serialized array as if it were a regular array property
            // (readArray() will handle correct loading for us).
            let loadedArray = this.readArray(deserializeParam);
            if (loadedArray === null)
                return null;
            // And let the constructor of class Set to convert it to Set object.
            return new Set(loadedArray);
        }
        //+
        // Converts 'param.sourceProperty' to a Map object.
        readMap(param) {
            let sourceRecord = this.readSourceRecord(param, Serializable.MAP_PROPERTY);
            if (sourceRecord === null)
                return null;
            // In order to deserialize a Map object, we need to load all items
            // in array which represents it in serialized form, because they
            // may require special handling themselvs (for example if you put
            // another Map into your Map).
            // Setup a new deserialize param.
            let deserializeParam = {
                propertyName: 'Serialized record: Map',
                targetProperty: [],
                sourceProperty: sourceRecord,
                path: param.path
            };
            // Load serialized array as if it were a regular array property
            // (readArray() will handle correct loading for us).
            let loadedArray = this.readArray(deserializeParam);
            if (loadedArray === null)
                return null;
            // And let the constructor of class Map to convert it to Map object.
            return new Map(loadedArray);
        }
        // TODO: This should not be in Serializable.
        // // Converts 'param.sourceProperty' to a reference to an Entity.
        // // If 'id' loaded from JSON already exists in Entities, existing
        // // entity will be returned. Otherwise an 'invalid'
        // // entity reference will be created and returned.
        // // -> Retuns an existing entity or an invalid entity reference.
        // protected readEntityReference
        // (
        //   sourceProperty: Object,
        //   propertyName: string,
        //   pathString: string
        // )
        // {
        //   if (!sourceProperty)
        //     return null;
        //   let id = (sourceProperty as any)[Serializable.ID_PROPERTY];
        //   if (id === undefined || id === null)
        //   {
        //     ERROR("Missing or invalid '" + Serializable.ID_PROPERTY + "'"
        //       + " property when loading entity reference '" + propertyName + "'"
        //       + pathString);
        //   }
        //   if (!Application.entities)
        //   {
        //     ERROR("Unexpected 'null' value");
        //     return null;
        //   }
        //   // Note: We have to access entities using App.entities rather than
        //   //   Etities because importing {Entities} to Serializable would lead
        //   //   to circular imports expection.
        //   return Application.entities.getReference(id)
        // }
        //+
        // Converts 'param.sourceProperty' to Array.
        readArray(param) {
            // Note:
            //   Array doesn't have a serialized record, because it's
            // a directly serializable class. We don't have to have a
            // special handling for deserializing of an Array, we need
            // special handling for deserializing it's CONTENTS (because
            // there may be Sets, Maps, custom classes or similar objects
            // in the Array that need to be deserialized in a special way).
            let sourceArray = param.sourceProperty;
            if (sourceArray === null || sourceArray === undefined) {
                let pathString = this.composePathString(param.path);
                ERROR_1.ERROR("Attempt to loadArray from invalid JSON property"
                    + " '" + param.propertyName + "'" + pathString);
                return null;
            }
            if (!Array.isArray(sourceArray)) {
                let pathString = this.composePathString(param.path);
                ERROR_1.ERROR("Attempt to read Array from non-Array json property"
                    + " '" + param.propertyName + "'" + pathString);
                return null;
            }
            return this.readArrayContents(sourceArray, param.path);
        }
        //+
        // Deserializes contents of an Array property.
        readArrayContents(sourceArray, path) {
            let newArray = [];
            for (let i = 0; i < sourceArray.length; i++) {
                let item = this.readArrayItem(sourceArray[i], i, path);
                newArray.push(item);
            }
            return newArray;
        }
        //+
        // Deserializes contents of a single Array item
        // ('index' and 'path' are used only for error messages).
        readArrayItem(item, index, path) {
            // Setup a new deserialize param.
            let deserializeParam = {
                propertyName: 'Array item [' + index + ']',
                // We need to pass 'null' as 'sourceProperty' so an instance
                // of corect type will be created (by createNewIfNull()).
                targetProperty: null,
                sourceProperty: item,
                path: path
            };
            // Let 'readProperty()' method load the contents of an array item.
            return this.deserializeProperty(deserializeParam);
        }
        // ------------------------------------------------- //
        //                 Auxiliary methods                 //
        // ------------------------------------------------- //
        //+
        isDeserializable(instance) {
            return ('deserialize' in instance);
        }
        //+
        // -> Returns 'param.sourceProperty[recordName]' if it exists,
        //   'null' otherwise.
        readSourceRecord(param, recordName) {
            if (!param.sourceProperty)
                return null;
            let sourceRecord = param.sourceProperty[recordName];
            if (sourceRecord === undefined || sourceRecord === null) {
                let pathString = this.composePathString(param.path);
                ERROR_1.ERROR("Missing or invalid '" + recordName + "' property when"
                    + " loading " + recordName + " record '" + param.propertyName + "'"
                    + pathString);
                return null;
            }
            return sourceRecord;
        }
        //+
        // -> Returns 'false' if 'jsonObject' is 'null' or 'undefined
        //    ('null' value is not considered an error, 'undefined' is).
        isObjectValid(jsonObject) {
            // Technically there can be a special record (entity reference,
            // date record or map record) saved with 'null' value, but in
            // that case we don't have to load it as special record, because
            // it will be null anyways.
            if (jsonObject === null)
                return false;
            if (jsonObject === undefined) {
                ERROR_1.ERROR("Invalid jsonObject");
                return false;
            }
            return true;
        }
        // ------------ Protected static methods -------------- 
        // ------------- Private static methods ---------------
        static createSaver(className) {
            let saver = new Serializable();
            // Fake the 'className' getter.    
            saver['getClassName'] = function () { return className; };
            return saver;
        }
        // -> Returns a SaveableObject which saves Set to Json object
        //      (using it's saveToJsonObject()) as a special object
        //      with className 'Set' and property 'set' containing
        //      an Array representation of Set contents.  
        createSetSaver(set) {
            if (set === null) {
                FATAL_ERROR_1.FATAL_ERROR("Null set");
                return new Serializable(); // Never happens, FATAL_ERROR stops the app.
            }
            let saver = Serializable.createSaver(Serializable.SET_CLASS_NAME);
            // Set is saved as it's Array representation to property 'set'.
            saver[Serializable.SET_PROPERTY] = this.saveSetToArray(set);
            return saver;
        }
        // -> Returns a SaveableObject which saves Map to Json object
        //      (using it's saveToJsonObject()) as a special object
        //      with className 'Map' and property 'map' containing
        //      an Array representation of hashmap contents.  
        createMapSaver(map) {
            if (map === null) {
                FATAL_ERROR_1.FATAL_ERROR("Null map");
                return new Serializable(); // Never happens, FATAL_ERROR stops the app.
            }
            let saver = Serializable.createSaver(Serializable.MAP_CLASS_NAME);
            // Map is saved as it's Array representation to property 'map'.
            saver[Serializable.MAP_PROPERTY] = this.saveMapToArray(map);
            return saver;
        }
        // -> Returns a SaveableObject which saves FastBitSet to Json
        //      object (using it's saveToJsonObject()) as a special object
        //      with className 'Bitvector' and property 'bitvector' containing
        //      a string represenation of FastBitSet object.
        createBitvectorSaver(bitvector) {
            if (bitvector === null) {
                FATAL_ERROR_1.FATAL_ERROR("Null bitvector");
                return new Serializable(); // Never happens, FATAL_ERROR stops the app.
            }
            let saver = Serializable.createSaver(Serializable.BITVECTOR_CLASS_NAME);
            // Bitvector is saved as it's JSON string representation to
            // property 'bitvector'.
            saver[Serializable.BITVECTOR_PROPERTY] = bitvector.toJSON();
            return saver;
        }
        // Date() should no longer be used, Time() should be used instead.
        // // -> Returns a SaveableObject which saves Date to Json object
        // //      (using it's saveToJsonObject()) as a special object
        // //      with className 'Date' and property 'date' containing
        // //      a string represenation of Date object.  
        // private createDateSaver(date: Date)
        // {
        //   if (date === null)
        //   {
        //     FATAL_ERROR("Null date");
        //     return;
        //   }
        //   let saver = Serializable.createSaver(Serializable.DATE_CLASS_NAME);
        //   // Date is saved as it's JSON string representation to property 'date'.
        //   saver[Serializable.DATE_PROPERTY] = date.toJSON();
        //   return saver;
        // }
        // -> Returns a SaveableObject which saves Entity to Json object
        //      (using it's saveToJsonObject()) as a special object
        //      with className 'Reference' and property 'id' containing
        //      an Array representation of hashmap contents.  
        createEntitySaver(entity) {
            if (entity === null) {
                FATAL_ERROR_1.FATAL_ERROR("Null entity");
                return new Serializable(); // Never happens, FATAL_ERROR stops the app.
            }
            let id = entity[Serializable.ID_PROPERTY];
            if (!id) {
                FATAL_ERROR_1.FATAL_ERROR("Attempt to serialize an entity with an invalid id");
                return new Serializable(); // Never happens, FATAL_ERROR stops the app.
            }
            let saver = Serializable.createSaver(Serializable.REFERENCE_CLASS_NAME);
            // Entity is saved as it's string id to property 'id'.
            saver[Serializable.ID_PROPERTY] = id;
            return saver;
        }
        // -> Returns an Array representation of Set object.
        saveBitvectorToArray(bitvector) {
            if (!('array' in bitvector)) {
                ERROR_1.ERROR('Attempt to save bitvector to array that is'
                    + ' not of type FastBitSet. Empty array is saved');
                return [];
            }
            // FastBitSet already contains method to convert bitvector to Array,
            // so we just call it.
            return bitvector.array();
        }
        // -> Returns an Array representation of Set object.
        saveSetToArray(set) {
            let result = [];
            for (let entry of set.values())
                result.push(entry);
            return result;
        }
        // -> Returns an Array representation of Map object.
        saveMapToArray(map) {
            let result = [];
            for (let entry of map.entries())
                result.push(entry);
            return result;
        }
        objectValidityCheck(jsonObject) {
            // Technically there can be a special record (entity reference,
            // date record or map record) saved with 'null' value, but in
            // that case we don't have to load it as special record, because
            // it will be null anyways.
            if (jsonObject === null)
                return false;
            if (jsonObject === undefined) {
                ERROR_1.ERROR("Invalid jsonObject");
                return false;
            }
            return true;
        }
        //+
        // -> Returns string informing about file location or empty string
        //    if 'path' is not available.
        composePathString(path) {
            if (path === null)
                return "";
            return " in file " + path;
        }
        reportSerializeDateErorr() {
            ERROR_1.ERROR("Attempt to serialize property of type Date()."
                + " Date object should not be used because it can't"
                + " be properly inherited using prototypal inheritance."
                + " use class Time instead. Property is not serialized");
        }
    }
    exports.Serializable = Serializable;
    (function (Serializable) {
        let Mode;
        (function (Mode) {
            Mode[Mode["SAVE_TO_FILE"] = 0] = "SAVE_TO_FILE";
            Mode[Mode["SEND_TO_CLIENT"] = 1] = "SEND_TO_CLIENT";
            Mode[Mode["SEND_TO_SERVER"] = 2] = "SEND_TO_SERVER";
            Mode[Mode["SEND_TO_EDITOR"] = 3] = "SEND_TO_EDITOR";
        })(Mode = Serializable.Mode || (Serializable.Mode = {}));
    })(Serializable = exports.Serializable || (exports.Serializable = {}));
});
//# sourceMappingURL=Serializable.js.map