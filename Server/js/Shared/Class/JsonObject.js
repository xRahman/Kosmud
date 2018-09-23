/*
  Part of BrutusNEXT

  Auxiliary static class that serializes objects to and from JSON.
*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const ERROR_1 = require("../../Shared/ERROR");
let beautify = require('js-beautify').js_beautify;
class JsonObject {
    // ---------------- Public methods --------------------
    // Same as JSON.stringify() but with more readable formatting.
    static stringify(jsonObject) {
        let jsonString = JSON.stringify(jsonObject);
        jsonString = beautify(jsonString, {
            "indent_size": 2,
            "indent_char": " ",
            "eol": "\n",
            "brace_style": "expand",
            "keep_array_indentation": true,
            "end_with_newline": false
        });
        return jsonString;
    }
    // Same as JSON.parse() but with exception handling.
    static parse(jsonString, path = null) {
        let jsonObject = {};
        try {
            jsonObject = JSON.parse(jsonString);
        }
        catch (e) {
            let pathString = this.composePathString(path);
            ERROR_1.ERROR("Syntax error in JSON data: " + e.message + pathString);
            return null;
        }
        return jsonObject;
    }
    // ---------------- Private methods -------------------
    // Auxiliary function used for error reporting.
    // -> Returns string informing about file location or empty string
    //    if 'path' is not available.
    static composePathString(path) {
        if (path === null)
            return "";
        return " in file " + path;
    }
}
exports.JsonObject = JsonObject;
//# sourceMappingURL=JsonObject.js.map