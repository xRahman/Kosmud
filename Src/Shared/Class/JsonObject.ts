/*
  Part of Kosmud

  Auxiliary static class that serializes objects to and from JSON.
*/

import { js_beautify as beautify } from "js-beautify";

export namespace JsonObject
{
  // ---------------- Public methods --------------------

  // Same as JSON.stringify() but with more readable formatting.
  export function stringify(jsonObject: object): string
  {
    let jsonString = JSON.stringify(jsonObject);

    jsonString = beautify
    (
      jsonString,
      {
        indent_size: 2,
        indent_char: " ",
        eol: "\n",
        brace_style: "expand",
        keep_array_indentation: true,
        end_with_newline: false
      }
    );

    return jsonString;
  }

  // ! Throws exception on error.
  // Same as JSON.parse() but with more informative error message.
  export function parse(jsonString: string, path?: string): object
  {
    try
    {
      return JSON.parse(jsonString);
    }
    catch (e)
    {
      throw new Error(`Syntax error in JSON data:`
        + ` ${e.message}${fileInfo(path)}`);
    }
  }
}

// ----------------- Auxiliary Functions ---------------------

function fileInfo(path?: string)
{
  if (!path)
    return "";

  return ` in file ${path}`;
}