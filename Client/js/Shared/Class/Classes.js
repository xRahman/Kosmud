/*
  Part of Kosmud

  Stores constructors of dynamic classes so they can be instantiated
  in runtime.
*/
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Classes {
        // ------------- Public static methods ----------------
        static registerSerializableClass(Class) {
            this.serializables.set(Class.name, Class);
        }
    }
    // Classes extended from Serializable but not from Entity.
    Classes.serializables = new Map();
    // Classes extended from Entity.
    // (we keep Entity classes aside from other Serializable classes
    //  even though Entity is extended from Serializable because they
    //  are instantiated differently).
    Classes.entities = new Map();
    exports.Classes = Classes;
});
//# sourceMappingURL=Classes.js.map